import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Brain,
  CheckCircle2,
  FileImage,
  Upload,
  Loader2,
  Download,
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import type { Case, File, AIReport, HumanReview } from "@shared/schema";

interface CaseDetail extends Case {
  files: File[];
  aiReport: AIReport | null;
  reviews: HumanReview[];
}

export default function DentistReview() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [reviewFile, setReviewFile] = useState<File | null>(null);

  const { data: caseData, isLoading } = useQuery<CaseDetail>({
    queryKey: [`/api/cases/${id}`],
  });

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/reviews", {
        caseId: id,
        notes: notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cases/${id}`] });
      toast({
        title: "Review submitted",
        description: "Your review has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      return await apiRequest("PATCH", `/api/reviews/${reviewId}`, {
        status: "COMPLETED",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cases/${id}`] });
      toast({
        title: "Review completed",
        description: "The review has been marked as complete",
      });
      setLocation("/dentist");
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
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
          <Button onClick={() => setLocation('/dentist')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentReview = caseData.reviews?.find(r => r.status === 'IN_PROGRESS');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dentist">
              <Button variant="ghost" size="icon" data-testid="button-back" className="hover-elevate active-elevate-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Review Case #{id?.slice(0, 8)}</h1>
              <p className="text-sm text-muted-foreground">
                Professional Second Opinion
              </p>
            </div>
          </div>
          <Badge className="bg-medical-dentist text-white">{caseData.status}</Badge>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Patient Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Patient's Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{caseData.symptoms || 'No symptoms described'}</p>
              </CardContent>
            </Card>

            {/* Medical Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Medical Images ({caseData.files?.length || 0})
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
                        <Button size="icon" variant="ghost" data-testid={`button-view-file-${file.id}`}>
                          <Download className="h-4 w-4" />
                        </Button>
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
                    AI Analysis Reference
                  </CardTitle>
                  <CardDescription>
                    Confidence: {(caseData.aiReport.confidence * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">AI Summary</h4>
                    <p className="text-sm">{caseData.aiReport.summary}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">AI Findings</h4>
                    <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs">
                      {JSON.stringify(caseData.aiReport.findings, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Form */}
            <Card className="border-medical-dentist/20">
              <CardHeader>
                <CardTitle>Your Professional Review</CardTitle>
                <CardDescription>
                  Provide your expert analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Clinical Notes</label>
                  <Textarea
                    placeholder="Enter your clinical findings, diagnosis, and recommendations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-32"
                    data-testid="textarea-review-notes"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Signed Report (Optional)</label>
                  <div className="rounded-lg border-2 border-dashed p-6 text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="mb-2 text-sm">Upload signed PDF report</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setReviewFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="review-file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('review-file-upload')?.click()}
                      data-testid="button-upload-report"
                      className="hover-elevate active-elevate-2"
                    >
                      Choose File
                    </Button>
                    {reviewFile && (
                      <p className="mt-2 text-xs text-muted-foreground">{reviewFile.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => createReviewMutation.mutate()}
                    disabled={createReviewMutation.isPending || !notes}
                    className="flex-1 hover-elevate active-elevate-2"
                    data-testid="button-save-review"
                  >
                    {createReviewMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                    ) : (
                      "Save Review"
                    )}
                  </Button>
                  {currentReview && (
                    <Button
                      onClick={() => completeReviewMutation.mutate(currentReview.id)}
                      disabled={completeReviewMutation.isPending}
                      variant="default"
                      className="flex-1 bg-medical-dentist hover-elevate active-elevate-2"
                      data-testid="button-complete-review"
                    >
                      {completeReviewMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Completing...</>
                      ) : (
                        <><CheckCircle2 className="mr-2 h-4 w-4" />Mark Complete</>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Info */}
            <Card>
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case ID</span>
                  <span className="font-mono text-xs">{id?.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(caseData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files</span>
                  <span>{caseData.files?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Analysis</span>
                  <span>{caseData.aiReport ? 'Available' : 'Not available'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Review Status */}
            {currentReview && (
              <Card className="border-medical-dentist/20 bg-medical-dentist/5">
                <CardHeader>
                  <CardTitle>Review Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={currentReview.status === 'COMPLETED' ? 'default' : 'outline'}>
                      {currentReview.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Started {new Date(currentReview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {currentReview.notes && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Last saved notes:</p>
                      <p className="mt-1 text-sm">{currentReview.notes.slice(0, 100)}...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Review Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>• Provide detailed clinical assessment</p>
                <p>• Reference specific findings from images</p>
                <p>• Offer treatment recommendations</p>
                <p>• Include risk factors if applicable</p>
                <p>• Sign and upload PDF if required</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
