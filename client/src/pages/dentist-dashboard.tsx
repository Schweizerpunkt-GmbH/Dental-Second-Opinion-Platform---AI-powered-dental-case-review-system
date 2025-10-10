import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Clock, CheckCircle2, DollarSign } from "lucide-react";
import type { HumanReview, Case } from "@shared/schema";
import { Link } from "wouter";

export default function DentistDashboard() {
  const { data: reviews = [], isLoading } = useQuery<(HumanReview & { case: Case })[]>({
    queryKey: ['/api/reviews/dentist'],
  });

  const pendingReviews = reviews.filter(r => r.status === 'REQUESTED' || r.status === 'IN_PROGRESS');
  const completedReviews = reviews.filter(r => r.status === 'COMPLETED');

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
          <h1 className="text-xl font-semibold">Dentist Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-medical-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-medical-payment" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedReviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-medical-payment" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${completedReviews.length * 60}</div>
            </CardContent>
          </Card>
        </div>

        {/* Review Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Review Queue</CardTitle>
            <CardDescription>Cases awaiting your expert review</CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">No reviews assigned</p>
                <p className="text-sm text-muted-foreground">New cases will appear here when assigned to you</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Patient Symptoms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} className="hover-elevate">
                      <TableCell className="font-mono text-xs">
                        {review.caseId.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2 text-sm">
                          {review.case?.symptoms || 'No symptoms provided'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={review.status === 'COMPLETED' ? 'default' : 'secondary'}
                          className={
                            review.status === 'COMPLETED'
                              ? 'bg-medical-payment text-white'
                              : review.status === 'IN_PROGRESS'
                              ? 'bg-medical-dentist text-white'
                              : ''
                          }
                        >
                          {review.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/review/${review.caseId}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-review-${review.id}`}
                            className="hover-elevate active-elevate-2"
                          >
                            {review.status === 'COMPLETED' ? 'View' : 'Review'}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
