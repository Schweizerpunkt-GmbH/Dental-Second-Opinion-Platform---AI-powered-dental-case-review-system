import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, CheckCircle2, ArrowRight, ArrowLeft, X, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const uploadSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in at least 10 characters").max(1000),
});

export default function UploadWizard() {
  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPaymentType, setSelectedPaymentType] = useState<"AI" | "REVIEW" | null>(null);

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof uploadSchema>) => {
      const response = await apiRequest("POST", "/api/cases", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCaseId(data.id);
      setStep(2);
      queryClient.invalidateQueries({ queryKey: ['/api/cases'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof uploadSchema>) => {
    createCaseMutation.mutate(data);
  };

  const handleFileUploadComplete = () => {
    setStep(3);
    toast({
      title: "Files uploaded successfully",
      description: "Your case has been created and is ready for analysis",
    });
  };

  const paymentMutation = useMutation({
    mutationFn: async (type: "AI" | "REVIEW") => {
      const response = await apiRequest("POST", "/api/payments/create-checkout", {
        caseId,
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

  const handleSkipPayment = () => {
    setLocation(`/case/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Create New Case</h1>
          <Button
            variant="outline"
            onClick={() => setLocation('/dashboard')}
            data-testid="button-back-dashboard"
            className="hover-elevate active-elevate-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Symptoms" },
              { num: 2, label: "Upload" },
              { num: 3, label: "Payment" },
              { num: 4, label: "Results" },
            ].map((s, i) => (
              <div key={s.num} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      step >= s.num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="mt-2 text-xs font-medium">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`h-0.5 flex-1 ${step > s.num ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Symptoms */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Symptoms</CardTitle>
              <CardDescription>
                Tell us about your dental concerns, pain, or questions about your treatment plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms & Concerns</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Example: I have pain in my upper right molar. My dentist recommended a root canal, but I'd like a second opinion on whether this is necessary..."
                            className="min-h-[200px]"
                            data-testid="input-symptoms"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 10 characters. Be as detailed as possible for better analysis.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createCaseMutation.isPending}
                    data-testid="button-next-upload"
                    className="w-full hover-elevate active-elevate-2 sm:w-auto"
                  >
                    {createCaseMutation.isPending ? "Creating Case..." : "Continue to Upload"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Upload */}
        {step === 2 && <FileUploadStep caseId={caseId} onBack={() => setStep(1)} onContinue={handleFileUploadComplete} />}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Analysis</CardTitle>
              <CardDescription>Select the type of analysis you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Analysis</CardTitle>
                    <CardDescription>Instant AI-powered report</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-3xl font-bold">$29</div>
                    <ul className="mb-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        AI analysis within minutes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Detailed findings report
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Confidence scoring
                      </li>
                    </ul>
                    <Button
                      className="w-full hover-elevate active-elevate-2"
                      onClick={() => paymentMutation.mutate("AI")}
                      disabled={paymentMutation.isPending}
                      data-testid="button-pay-ai"
                    >
                      {paymentMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                      ) : (
                        "Select AI Analysis"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover-elevate border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">AI + Expert Review</CardTitle>
                    <CardDescription>AI report + dentist verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-3xl font-bold">$89</div>
                    <ul className="mb-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Everything in AI Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Licensed dentist review
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Expert recommendations
                      </li>
                    </ul>
                    <Button
                      className="w-full hover-elevate active-elevate-2"
                      onClick={() => paymentMutation.mutate("REVIEW")}
                      disabled={paymentMutation.isPending}
                      data-testid="button-pay-expert"
                    >
                      {paymentMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                      ) : (
                        "Select Expert Review"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  data-testid="button-back-upload"
                  className="hover-elevate active-elevate-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSkipPayment}
                  variant="outline"
                  data-testid="button-skip-payment"
                  className="flex-1 hover-elevate active-elevate-2"
                >
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

interface FileUploadStepProps {
  caseId: string;
  onBack: () => void;
  onContinue: () => void;
}

function FileUploadStep({ caseId, onBack, onContinue }: FileUploadStepProps) {
  const [files, setFiles] = useState<Array<{ file: File; kind: string; id: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        kind: "OTHER",
        id: crypto.randomUUID(),
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileKind = (id: string, kind: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, kind } : f));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      for (const { file, kind } of files) {
        // Create file record in database
        await apiRequest("POST", "/api/files", {
          caseId,
          kind,
          s3Key: `${caseId}/${file.name}`,
          mime: file.type,
          size: file.size,
        });
      }

      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) uploaded`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/files/case', caseId] });
      onContinue();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Images</CardTitle>
        <CardDescription>
          Upload X-rays, OPT, DVT, CBCT scans, or treatment offer documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:border-primary/50">
          <FileImage className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">Select files to upload</p>
          <p className="mb-4 text-xs text-muted-foreground">
            Supports JPEG, PNG, DICOM, PDF files
          </p>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.dcm,.pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            data-testid="button-browse-files"
            className="hover-elevate active-elevate-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
            {files.map(({ file, kind, id }) => (
              <div key={id} className="flex items-center gap-4 rounded-lg border p-3">
                <FileImage className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Select value={kind} onValueChange={(value) => updateFileKind(id, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RX">X-Ray</SelectItem>
                    <SelectItem value="OPT">OPT</SelectItem>
                    <SelectItem value="DVT">DVT</SelectItem>
                    <SelectItem value="CBCT">CBCT</SelectItem>
                    <SelectItem value="OFFER">Offer</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(id)}
                  data-testid={`button-remove-file-${id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={uploading}
            data-testid="button-back-symptoms"
            className="hover-elevate active-elevate-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            data-testid="button-continue-payment"
            className="flex-1 hover-elevate active-elevate-2"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
