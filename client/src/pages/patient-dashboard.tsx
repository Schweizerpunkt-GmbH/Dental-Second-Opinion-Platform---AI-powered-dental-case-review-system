import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Brain, UserCheck, Plus, Eye } from "lucide-react";
import type { Case } from "@shared/schema";
import { Link } from "wouter";

export default function PatientDashboard() {
  const { data: cases = [], isLoading } = useQuery<Case[]>({
    queryKey: ['/api/cases'],
  });

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">My Cases</h1>
          <Button
            onClick={() => window.location.href = '/api/logout'}
            variant="outline"
            data-testid="button-logout"
            className="hover-elevate active-elevate-2"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Analyzed</CardTitle>
              <Brain className="h-4 w-4 text-medical-ai" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cases.filter(c => c.status === 'AI_DONE' || c.status === 'DOCTOR_ASSIGNED' || c.status === 'CLOSED').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expert Reviews</CardTitle>
              <UserCheck className="h-4 w-4 text-medical-dentist" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cases.filter(c => c.status === 'DOCTOR_ASSIGNED' || c.status === 'CLOSED').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Upload className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cases.filter(c => c.status === 'DRAFT' || c.status === 'QUEUED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
            <div>
              <h3 className="mb-1 text-lg font-semibold">Start a New Case</h3>
              <p className="text-sm text-muted-foreground">Upload your dental images and get AI-powered insights</p>
            </div>
            <Link href="/upload">
              <Button size="lg" data-testid="button-new-case" className="hover-elevate active-elevate-2">
                <Plus className="mr-2 h-4 w-4" />
                New Case
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cases List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Cases</h2>
          {cases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">No cases yet</p>
                <p className="mb-4 text-sm text-muted-foreground">Create your first case to get started</p>
                <Link href="/upload">
                  <Button data-testid="button-create-first-case" className="hover-elevate active-elevate-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Case
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {cases.map((caseItem) => (
                <Card key={caseItem.id} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <CardTitle className="text-base">Case #{caseItem.id.slice(0, 8)}</CardTitle>
                          {getStatusBadge(caseItem.status)}
                        </div>
                        <CardDescription>
                          {caseItem.symptoms ? (
                            <span className="line-clamp-2">{caseItem.symptoms}</span>
                          ) : (
                            <span className="text-muted-foreground">No symptoms described</span>
                          )}
                        </CardDescription>
                      </div>
                      <Link href={`/case/${caseItem.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${caseItem.id}`} className="hover-elevate active-elevate-2">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                      {caseItem.status === 'AI_DONE' && (
                        <span className="flex items-center gap-1 text-medical-ai">
                          <Brain className="h-3 w-3" />
                          AI Report Available
                        </span>
                      )}
                      {(caseItem.status === 'DOCTOR_ASSIGNED' || caseItem.status === 'CLOSED') && (
                        <span className="flex items-center gap-1 text-medical-dentist">
                          <UserCheck className="h-3 w-3" />
                          Dentist Review Available
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
