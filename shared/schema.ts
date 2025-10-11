import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums matching the Prisma specification
export const roleEnum = pgEnum('role', ['PATIENT', 'DENTIST', 'ADMIN']);
export const caseStatusEnum = pgEnum('case_status', ['DRAFT', 'QUEUED', 'AI_DONE', 'DOCTOR_ASSIGNED', 'CLOSED']);
export const fileKindEnum = pgEnum('file_kind', ['RX', 'OPT', 'DVT', 'CBCT', 'OFFER', 'OTHER']);
export const reviewStatusEnum = pgEnum('review_status', ['REQUESTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']);
export const paymentTypeEnum = pgEnum('payment_type', ['AI', 'REVIEW', 'LEAD']);
export const paymentStatusEnum = pgEnum('payment_status', ['INIT', 'REQUIRES_ACTION', 'PAID', 'FAILED', 'REFUNDED']);
export const leadStatusEnum = pgEnum('lead_status', ['CREATED', 'SENT', 'ACCEPTED', 'DECLINED', 'PAID']);

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - extended for dental platform with role support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: roleEnum("role").notNull().default('PATIENT'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cases table
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: caseStatusEnum("status").notNull().default('DRAFT'),
  symptoms: text("symptoms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Files table for medical images and documents
export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: 'cascade' }),
  kind: fileKindEnum("kind").notNull(),
  s3Key: varchar("s3_key").notNull(),
  mime: varchar("mime").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Reports table
export const aiReports = pgTable("ai_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().unique().references(() => cases.id, { onDelete: 'cascade' }),
  summary: text("summary").notNull(),
  findings: jsonb("findings").notNull(),
  confidence: real("confidence").notNull(),
  pdfS3Key: varchar("pdf_s3_key").notNull(),
  originalPriceCHF: real("original_price_chf"),
  recommendedPriceCHF: real("recommended_price_chf"),
  potentialSavingsCHF: real("potential_savings_chf"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Human Reviews table (dentist reviews)
export const humanReviews = pgTable("human_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: 'cascade' }),
  dentistId: varchar("dentist_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  notes: text("notes"),
  status: reviewStatusEnum("status").notNull().default('REQUESTED'),
  signedPdfKey: varchar("signed_pdf_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: 'cascade' }),
  type: paymentTypeEnum("type").notNull(),
  amount: integer("amount").notNull(), // in cents
  status: paymentStatusEnum("status").notNull().default('INIT'),
  stripeSess: varchar("stripe_sess"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Practices table
export const practices = pgTable("practices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  city: varchar("city"),
  country: varchar("country"),
  roaadentOrgId: varchar("roaadent_org_id"),
  leadFee: integer("lead_fee").notNull().default(0),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull().references(() => cases.id, { onDelete: 'cascade' }),
  practiceId: varchar("practice_id").notNull().references(() => practices.id, { onDelete: 'cascade' }),
  status: leadStatusEnum("status").notNull().default('CREATED'),
  payoutCents: integer("payout_cents").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Log table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id"),
  action: varchar("action").notNull(),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cases: many(cases),
  reviews: many(humanReviews),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  user: one(users, {
    fields: [cases.userId],
    references: [users.id],
  }),
  files: many(files),
  aiReport: one(aiReports),
  reviews: many(humanReviews),
  payments: many(payments),
  leads: many(leads),
}));

export const filesRelations = relations(files, ({ one }) => ({
  case: one(cases, {
    fields: [files.caseId],
    references: [cases.id],
  }),
}));

export const aiReportsRelations = relations(aiReports, ({ one }) => ({
  case: one(cases, {
    fields: [aiReports.caseId],
    references: [cases.id],
  }),
}));

export const humanReviewsRelations = relations(humanReviews, ({ one }) => ({
  case: one(cases, {
    fields: [humanReviews.caseId],
    references: [cases.id],
  }),
  dentist: one(users, {
    fields: [humanReviews.dentistId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  case: one(cases, {
    fields: [payments.caseId],
    references: [cases.id],
  }),
}));

export const practicesRelations = relations(practices, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  case: one(cases, {
    fields: [leads.caseId],
    references: [cases.id],
  }),
  practice: one(practices, {
    fields: [leads.practiceId],
    references: [practices.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertAIReportSchema = createInsertSchema(aiReports).omit({
  id: true,
  createdAt: true,
});

export const insertHumanReviewSchema = createInsertSchema(humanReviews).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeSchema = createInsertSchema(practices).omit({
  id: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertAIReport = z.infer<typeof insertAIReportSchema>;
export type AIReport = typeof aiReports.$inferSelect;
export type InsertHumanReview = z.infer<typeof insertHumanReviewSchema>;
export type HumanReview = typeof humanReviews.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPractice = z.infer<typeof insertPracticeSchema>;
export type Practice = typeof practices.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
