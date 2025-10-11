import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  users, cases, files, aiReports, humanReviews, payments, practices, leads, auditLogs,
  insertCaseSchema, insertPaymentSchema, insertHumanReviewSchema, insertAuditLogSchema, insertFileSchema,
  type User
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import Stripe from "stripe";
import { setupAuth, isAuthenticated } from "./replitAuth";
import crypto from "crypto";
import { analyzeCase } from "./aiService";

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

// Audit logging middleware
async function logAudit(actorId: string | undefined, action: string, meta?: any) {
  try {
    await db.insert(auditLogs).values({
      actorId,
      action,
      meta: meta || {},
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}

// Role-based middleware
function requireRole(role: string) {
  return (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

// AI Analysis processing function
async function processAIAnalysis(caseId: string) {
  try {
    // Fetch case and files
    const [caseData] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, caseId))
      .limit(1);

    if (!caseData) {
      throw new Error("Case not found");
    }

    const caseFiles = await db
      .select()
      .from(files)
      .where(eq(files.caseId, caseId));

    // Run AI analysis
    const result = await analyzeCase(caseId, caseData.symptoms || "", caseFiles);

    // Store AI report with cost savings
    await db.insert(aiReports).values({
      caseId,
      summary: result.summary,
      findings: result.findings,
      confidence: result.confidence,
      originalPriceCHF: result.originalPriceCHF,
      recommendedPriceCHF: result.recommendedPriceCHF,
      potentialSavingsCHF: result.potentialSavingsCHF,
    });

    // Update case status
    await db
      .update(cases)
      .set({ status: "AI_DONE" })
      .where(eq(cases.id, caseId));

    await logAudit(undefined, "AI_ANALYSIS_COMPLETED", { caseId });
  } catch (error) {
    console.error("AI analysis error:", error);
    await logAudit(undefined, "AI_ANALYSIS_FAILED", { caseId, error: String(error) });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Replit Auth
  await setupAuth(app);
  
  // ============= AUTH ROUTES =============
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    res.json(req.user);
  });

  // ============= CASE ROUTES =============
  app.get("/api/cases", isAuthenticated, async (req: any, res) => {
    try {
      const userCases = await db
        .select()
        .from(cases)
        .where(eq(cases.userId, req.user.id))
        .orderBy(desc(cases.createdAt));
      
      await logAudit(req.user.id, "LIST_CASES", { count: userCases.length });
      res.json(userCases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cases/:id", async (req: any, res) => {
    try {
      const caseId = req.params.id;
      const [caseData] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }

      // Allow access to anonymous cases or require auth for owned cases
      if (caseData.userId !== "anonymous" && !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check ownership or admin/dentist access for non-anonymous cases
      if (
        caseData.userId !== "anonymous" &&
        req.user &&
        caseData.userId !== req.user.id &&
        req.user.role !== "ADMIN" &&
        req.user.role !== "DENTIST"
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Get related data
      const [caseFiles, aiReport, reviews, casePayments] = await Promise.all([
        db.select().from(files).where(eq(files.caseId, caseId)),
        db.select().from(aiReports).where(eq(aiReports.caseId, caseId)).limit(1),
        db.select().from(humanReviews).where(eq(humanReviews.caseId, caseId)),
        db.select().from(payments).where(eq(payments.caseId, caseId)),
      ]);

      await logAudit(req.user?.id, "VIEW_CASE", { caseId, anonymous: caseData.userId === "anonymous" });

      res.json({
        ...caseData,
        files: caseFiles,
        aiReport: aiReport[0] || null,
        reviews,
        payments: casePayments,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Anonymous case creation (no auth required)
  app.post("/api/cases/anonymous", async (req: any, res) => {
    try {
      const validatedData = insertCaseSchema.parse({
        ...req.body,
        userId: "anonymous", // Temporary placeholder
        status: "DRAFT",
      });

      const [newCase] = await db.insert(cases).values(validatedData).returning();
      
      await logAudit(undefined, "CREATE_ANONYMOUS_CASE", { caseId: newCase.id });
      res.status(201).json(newCase);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/cases", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertCaseSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "DRAFT",
      });

      const [newCase] = await db.insert(cases).values(validatedData).returning();
      
      await logAudit(req.user.id, "CREATE_CASE", { caseId: newCase.id });
      res.status(201).json(newCase);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Claim anonymous case after login
  app.post("/api/cases/:id/claim", isAuthenticated, async (req: any, res) => {
    try {
      const caseId = req.params.id;
      const [existingCase] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!existingCase) {
        return res.status(404).json({ message: "Case not found" });
      }

      if (existingCase.userId !== "anonymous") {
        return res.status(400).json({ message: "Case already claimed" });
      }

      const [updatedCase] = await db
        .update(cases)
        .set({ userId: req.user.id })
        .where(eq(cases.id, caseId))
        .returning();

      await logAudit(req.user.id, "CLAIM_CASE", { caseId });
      res.json(updatedCase);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/cases/:id", isAuthenticated, async (req: any, res) => {
    try {
      const caseId = req.params.id;
      const [existingCase] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!existingCase || existingCase.userId !== req.user.id) {
        return res.status(404).json({ message: "Case not found" });
      }

      const [updatedCase] = await db
        .update(cases)
        .set(req.body)
        .where(eq(cases.id, caseId))
        .returning();

      await logAudit(req.user.id, "UPDATE_CASE", { caseId, changes: req.body });
      res.json(updatedCase);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============= PAYMENT ROUTES =============
  app.post("/api/payments/create-checkout", isAuthenticated, async (req: any, res) => {
    try {
      const { caseId, type } = req.body;

      // Validate case ownership
      const [caseData] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!caseData || caseData.userId !== req.user.id) {
        return res.status(404).json({ message: "Case not found" });
      }

      // Determine amount based on type (CHF cents)
      const amounts: Record<string, number> = {
        AI: 990, // 9.90 CHF
        REVIEW: 6000, // 60 CHF
        LEAD: 0,
      };

      const amount = amounts[type] || 990;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "chf",
              product_data: {
                name: type === "AI" ? "AI Analysis" : "Expert Dentist Review",
                description: `Dental second opinion for case ${caseId.slice(0, 8)}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.REPL_HOME || 'http://localhost:5000'}/case/${caseId}?payment=success`,
        cancel_url: `${process.env.REPL_HOME || 'http://localhost:5000'}/case/${caseId}?payment=cancel`,
        metadata: {
          caseId,
          userId: req.user.id,
          type,
        },
      });

      // Create payment record
      const validatedPayment = insertPaymentSchema.parse({
        caseId,
        type,
        amount,
        status: "INIT",
        stripeSess: session.id,
      });

      const [payment] = await db.insert(payments).values(validatedPayment).returning();

      await logAudit(req.user.id, "CREATE_PAYMENT", { paymentId: payment.id, type, amount });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update payment status
      await db
        .update(payments)
        .set({ status: "PAID" })
        .where(eq(payments.stripeSess, session.id));

      // Update case status based on payment type
      const metadata = session.metadata;
      if (metadata?.type === "AI" && metadata.caseId) {
        await db
          .update(cases)
          .set({ status: "QUEUED" })
          .where(eq(cases.id, metadata.caseId));

        // Trigger AI analysis asynchronously
        processAIAnalysis(metadata.caseId).catch(console.error);
      }

      if (metadata?.type === "REVIEW" && metadata.caseId) {
        // Create review record and assign to dentist
        const [dentist] = await db
          .select()
          .from(users)
          .where(eq(users.role, "DENTIST"))
          .limit(1);

        if (dentist) {
          await db.insert(humanReviews).values({
            caseId: metadata.caseId,
            dentistId: dentist.id,
            status: "REQUESTED",
          });

          await db
            .update(cases)
            .set({ status: "DOCTOR_ASSIGNED" })
            .where(eq(cases.id, metadata.caseId));
        }
      }

      await logAudit(metadata?.userId, "PAYMENT_COMPLETED", {
        sessionId: session.id,
        caseId: metadata?.caseId,
      });
    }

    res.json({ received: true });
  });

  // ============= DENTIST ROUTES =============
  app.get("/api/reviews/dentist", isAuthenticated, requireRole("DENTIST"), async (req: any, res) => {
    try {
      const reviews = await db
        .select({
          id: humanReviews.id,
          caseId: humanReviews.caseId,
          dentistId: humanReviews.dentistId,
          notes: humanReviews.notes,
          status: humanReviews.status,
          signedPdfKey: humanReviews.signedPdfKey,
          createdAt: humanReviews.createdAt,
          case: cases,
        })
        .from(humanReviews)
        .leftJoin(cases, eq(humanReviews.caseId, cases.id))
        .where(eq(humanReviews.dentistId, req.user.id))
        .orderBy(desc(humanReviews.createdAt));

      await logAudit(req.user.id, "LIST_REVIEWS", { count: reviews.length });
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/reviews/:id", isAuthenticated, requireRole("DENTIST"), async (req: any, res) => {
    try {
      const reviewId = req.params.id;
      const [existingReview] = await db
        .select()
        .from(humanReviews)
        .where(eq(humanReviews.id, reviewId))
        .limit(1);

      if (!existingReview || existingReview.dentistId !== req.user.id) {
        return res.status(404).json({ message: "Review not found" });
      }

      const [updatedReview] = await db
        .update(humanReviews)
        .set(req.body)
        .where(eq(humanReviews.id, reviewId))
        .returning();

      // Update case status if review completed
      if (req.body.status === "COMPLETED") {
        await db
          .update(cases)
          .set({ status: "CLOSED" })
          .where(eq(cases.id, existingReview.caseId));
      }

      await logAudit(req.user.id, "UPDATE_REVIEW", { reviewId, changes: req.body });
      res.json(updatedReview);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============= ADMIN ROUTES =============
  app.get("/api/admin/stats", isAuthenticated, requireRole("ADMIN"), async (req: any, res) => {
    try {
      const [allCases, allUsers, allPayments, dentists] = await Promise.all([
        db.select().from(cases),
        db.select().from(users),
        db.select().from(payments).where(eq(payments.status, "PAID")),
        db.select().from(users).where(eq(users.role, "DENTIST")),
      ]);

      const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);

      await logAudit(req.user.id, "VIEW_ADMIN_STATS", {});

      res.json({
        totalCases: allCases.length,
        totalUsers: allUsers.length,
        totalRevenue,
        activeDentists: dentists.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/cases", isAuthenticated, requireRole("ADMIN"), async (req: any, res) => {
    try {
      const allCases = await db
        .select({
          id: cases.id,
          userId: cases.userId,
          status: cases.status,
          symptoms: cases.symptoms,
          createdAt: cases.createdAt,
          user: users,
        })
        .from(cases)
        .leftJoin(users, eq(cases.userId, users.id))
        .orderBy(desc(cases.createdAt));

      // Get payments for each case
      const casesWithPayments = await Promise.all(
        allCases.map(async (c) => {
          const casePayments = await db
            .select()
            .from(payments)
            .where(eq(payments.caseId, c.id));
          return { ...c, payments: casePayments };
        })
      );

      await logAudit(req.user.id, "LIST_ALL_CASES", { count: allCases.length });
      res.json(casesWithPayments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/audit-logs", isAuthenticated, requireRole("ADMIN"), async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit);

      await logAudit(req.user.id, "VIEW_AUDIT_LOGS", { limit });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= FILE UPLOAD ROUTES =============
  app.post("/api/files/upload-url", isAuthenticated, async (req: any, res) => {
    try {
      const { caseId, fileName, fileType, fileSize } = req.body;

      // Validate case ownership
      const [caseData] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!caseData || caseData.userId !== req.user.id) {
        return res.status(404).json({ message: "Case not found" });
      }

      // Generate unique file key
      const fileId = crypto.randomUUID();
      const s3Key = `${process.env.PRIVATE_OBJECT_DIR}/${caseId}/${fileId}-${fileName}`;

      // For Replit object storage, we'll use a simple approach
      // In production, generate actual presigned URLs
      const uploadUrl = `/api/files/upload/${fileId}`;

      await logAudit(req.user.id, "REQUEST_UPLOAD_URL", { caseId, fileName });

      res.json({
        uploadUrl,
        fileId,
        s3Key,
        method: "PUT",
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/files/upload/:fileId", isAuthenticated, async (req: any, res) => {
    try {
      // Simple file upload handler
      // In production, this would write to object storage
      const fileId = req.params.fileId;
      
      // For now, return success (file upload simulation)
      res.json({ success: true, fileId });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/files", isAuthenticated, async (req: any, res) => {
    try {
      const { caseId, kind, s3Key, mime, size } = req.body;

      // Validate case ownership
      const [caseData] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!caseData || caseData.userId !== req.user.id) {
        return res.status(404).json({ message: "Case not found" });
      }

      const validatedFile = insertFileSchema.parse({
        caseId,
        kind,
        s3Key,
        mime,
        size,
      });

      const [newFile] = await db.insert(files).values(validatedFile).returning();

      await logAudit(req.user.id, "UPLOAD_FILE", { fileId: newFile.id, caseId });

      res.status(201).json(newFile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/files/case/:caseId", isAuthenticated, async (req: any, res) => {
    try {
      const caseId = req.params.caseId;

      // Validate case access
      const [caseData] = await db
        .select()
        .from(cases)
        .where(eq(cases.id, caseId))
        .limit(1);

      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }

      if (
        caseData.userId !== req.user.id &&
        req.user.role !== "ADMIN" &&
        req.user.role !== "DENTIST"
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const caseFiles = await db
        .select()
        .from(files)
        .where(eq(files.caseId, caseId))
        .orderBy(desc(files.createdAt));

      res.json(caseFiles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= HEALTH CHECK =============
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
