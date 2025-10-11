import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, DollarSign, TrendingUp, Search, Building2, Link2, Download } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Case, User, Payment } from "@shared/schema";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats } = useQuery<{
    totalCases: number;
    totalUsers: number;
    totalRevenue: number;
    activeDentists: number;
  }>({
    queryKey: ['/api/admin/stats'],
  });

  const { data: cases = [] } = useQuery<(Case & { user: User; payments: Payment[] })[]>({
    queryKey: ['/api/admin/cases'],
  });

  const filteredCases = cases.filter(c =>
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
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
              <div className="text-2xl font-bold">{stats?.totalCases || 0}</div>
              <p className="text-xs text-muted-foreground">All time cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-medical-payment" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats?.totalRevenue || 0) / 100}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Dentists</CardTitle>
              <TrendingUp className="h-4 w-4 text-medical-dentist" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeDentists || 0}</div>
              <p className="text-xs text-muted-foreground">Verified professionals</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Management */}
        <Tabs defaultValue="cases" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cases" data-testid="tab-cases">
              <FileText className="mr-2 h-4 w-4" />
              Cases
            </TabsTrigger>
            <TabsTrigger value="practices" data-testid="tab-practices">
              <Building2 className="mr-2 h-4 w-4" />
              Practices
            </TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">
              <Link2 className="mr-2 h-4 w-4" />
              Leads
            </TabsTrigger>
          </TabsList>

          {/* Cases Tab */}
          <TabsContent value="cases">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Cases</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-cases"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">No cases found</p>
                <p className="text-sm text-muted-foreground">Cases will appear here as users create them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payments</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((caseItem) => (
                      <TableRow key={caseItem.id} className="hover-elevate">
                        <TableCell className="font-mono text-xs">
                          {caseItem.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{caseItem.user?.email}</span>
                            <span className="text-xs text-muted-foreground">{caseItem.user?.id.slice(0, 8)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{caseItem.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              ${(caseItem.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) / 100}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {caseItem.payments?.length || 0} payment(s)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-case-${caseItem.id}`}
                            className="hover-elevate active-elevate-2"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Practices Tab */}
          <TabsContent value="practices">
            <Card>
              <CardHeader>
                <CardTitle>Practice Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">Practice Management Coming Soon</p>
                  <p className="text-sm text-muted-foreground">Manage dental practices, set lead fees, and view statistics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Lead Management</CardTitle>
                  <Button variant="outline" data-testid="button-export-leads" className="hover-elevate active-elevate-2">
                    <Download className="mr-2 h-4 w-4" />
                    Export Leads
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">Lead Routing Coming Soon</p>
                  <p className="text-sm text-muted-foreground">View leads, manage assignments, and track payouts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
