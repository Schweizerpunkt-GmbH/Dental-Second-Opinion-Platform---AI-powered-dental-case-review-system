import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Brain, UserCheck, DollarSign, Download, FileImage, CreditCard, Loader2 } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import type { Case, File, AIReport, HumanReview, Payment } from "@shared/schema";

interface CaseDetail extends Case {
  files: File[];
  aiReport: AIReport | null;
  reviews: HumanReview[];
  payments: Payment[];
}

export default function CaseDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: caseData, isLoading } = useQuery<CaseDetail>({
    queryKey: [`/api/cases/${id}`],
  });

  const paymentMutation = useMutation({
    mutationFn: async (type: "AI" | "REVIEW") => {
      const response = await apiRequest("POST", "/api/payments/create-checkout", {
        caseId: id,
        type,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Payment error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Case not found</h1>
          <Button onClick={() => setLocation('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
      DRAFT: { variant: "outline", className: "bg-muted" },
      QUEUED: { variant: "default", className: "bg-primary" },
      AI_DONE: { variant: "secondary", className: "bg-medical-ai text-white" },
      DOCTOR_ASSIGNED: { variant: "secondary", className: "bg-medical-dentist text-white" },
      CLOSED: { variant: "secondary", className: "bg-medical-payment text-white" },
    };
    const config = variants[status] || variants.DRAFT;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const totalPaid = caseData.payments?.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" data-testid="button-back" className="hover-elevate active-elevate-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Case #{id?.slice(0, 8)}</h1>
              <p className="text-sm text-muted-foreground">
                Created {new Date(caseData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {getStatusBadge(caseData.status)}
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Symptoms & Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{caseData.symptoms || 'No symptoms described'}</p>
              </CardContent>
            </Card>

            {/* Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Uploaded Files ({caseData.files?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {caseData.files && caseData.files.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {caseData.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 rounded-lg border p-3 hover-elevate">
                        <FileImage className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium">{file.s3Key.split('/').pop()}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">{file.kind}</Badge>
                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No files uploaded</p>
                )}
              </CardContent>
            </Card>

            {/* AI Report */}
            {caseData.aiReport && (
              <Card className="border-medical-ai/20 bg-medical-ai/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-medical-ai" />
                    AI Analysis Report
                  </CardTitle>
                  <CardDescription>
                    Confidence Score: {(caseData.aiReport.confidence * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Summary</h4>
                    <p className="text-sm">{caseData.aiReport.summary}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Findings</h4>
                    <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">
                      {JSON.stringify(caseData.aiReport.findings, null, 2)}
                    </pre>
                  </div>
                  {caseData.aiReport.pdfS3Key && (
                    <Button className="w-full hover-elevate active-elevate-2" data-testid="button-download-ai-report">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Report
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dentist Reviews */}
            {caseData.reviews && caseData.reviews.length > 0 && (
              <Card className="border-medical-dentist/20 bg-medical-dentist/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-medical-dentist" />
                    Dentist Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {caseData.reviews.map((review) => (
                    <div key={review.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant={review.status === 'COMPLETED' ? 'default' : 'outline'}>
                          {review.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.notes && (
                        <p className="text-sm">{review.notes}</p>
                      )}
                      {review.signedPdfKey && (
                        <Button
                          className="mt-3 w-full hover-elevate active-elevate-2"
                          data-testid="button-download-dentist-review"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Signed Review
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {caseData.status === 'DRAFT' && (
                  <Button
                    className="w-full hover-elevate active-elevate-2"
                    onClick={() => paymentMutation.mutate("AI")}
                    disabled={paymentMutation.isPending}
                    data-testid="button-request-analysis"
                  >
                    {paymentMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                    ) : (
                      <><CreditCard className="mr-2 h-4 w-4" />Request Analysis (9.90 CHF)</>
                    )}
                  </Button>
                )}
                {caseData.status === 'AI_DONE' && !caseData.reviews?.length && (
                  <Button
                    className="w-full hover-elevate active-elevate-2"
                    onClick={() => paymentMutation.mutate("REVIEW")}
                    disabled={paymentMutation.isPending}
                    data-testid="button-request-dentist-review"
                  >
                    {paymentMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                    ) : (
                      <><UserCheck className="mr-2 h-4 w-4" />Request Dentist Review (60 CHF)</>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-semibold">${(totalPaid / 100).toFixed(2)}</span>
                  </div>
                  {caseData.payments && caseData.payments.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {caseData.payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{payment.type}</Badge>
                              <Badge
                                variant={payment.status === 'PAID' ? 'default' : 'outline'}
                                className={payment.status === 'PAID' ? 'bg-medical-payment text-white' : ''}
                              >
                                {payment.status}
                              </Badge>
                            </div>
                            <span className="font-medium">${(payment.amount / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Case Info */}
            <Card>
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case ID</span>
                  <span className="font-mono text-xs">{id?.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(caseData.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(caseData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files</span>
                  <span>{caseData.files?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
