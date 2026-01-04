import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign,
  Activity,
  BarChart3,
  Eye,
  Edit,
  Plus,
  Award,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getSalesMetrics,
  getSalesTeam,
  getLeads,
  createRecord,
  updateRecord,
  deleteRecord
} from '@/services/dashboardService';
import type { SalesMetrics as SalesMetricsType, SalesRep as SalesRepType, Lead as LeadType } from '@/services/dashboardService';

export default function SalesHeadDashboard() {
  const [metrics, setMetrics] = useState<SalesMetricsType>({
    totalRevenue: 0,
    targetRevenue: 0,
    totalLeads: 0,
    convertedLeads: 0,
    pendingLeads: 0,
    teamSize: 0,
    avgPerformance: 0
  });
  const [teamMembers, setTeamMembers] = useState<SalesRepType[]>([]);
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsData, teamMembersData, leadsData] = await Promise.all([
        getSalesMetrics(),
        getSalesTeam(),
        getLeads()
      ]);

      setMetrics(metricsData);
      setTeamMembers(teamMembersData);
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 100) return 'text-green-600';
    if (performance >= 80) return 'text-blue-600';
    if (performance >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-emerald-100 text-emerald-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceDisplayName = (service: string) => {
    const serviceNames: Record<string, string> = {
      webDesign: 'Web Design',
      digitalMarketing: 'Digital Marketing',
      branding: 'Branding & Design',
      videoProduction: 'Video Production',
      salesLeadGen: 'Sales & Lead Gen',
      strategyConsulting: 'Strategy & Consulting'
    };
    return serviceNames[service] || service;
  };

  const getTargetProgress = (achieved: number, target: number) => {
    return Math.min((achieved / target) * 100, 100);
  };

  const conversionRate = metrics.totalLeads > 0 
    ? Math.round((metrics.convertedLeads / metrics.totalLeads) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Head Dashboard</h1>
          <p className="text-gray-600">Sales team performance and pipeline management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Set Targets
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <Progress value={getTargetProgress(metrics.totalRevenue, metrics.targetRevenue)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              ${metrics.targetRevenue.toLocaleString()} target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.convertedLeads} of {metrics.totalLeads} leads converted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.avgPerformance)}`}>
              {metrics.avgPerformance}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.teamSize} team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leads</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingLeads}</div>
            <p className="text-xs text-muted-foreground">
              Requires follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
        </TabsList>

        {/* Team Performance Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Team Performance</CardTitle>
              <CardDescription>Individual performance metrics and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </p>
                        <p className="text-xs text-gray-500">Performance</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${member.commission.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Commission</p>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Target</span>
                          <span>${member.targets.achieved.toLocaleString()}</span>
                        </div>
                        <Progress value={getTargetProgress(member.targets.achieved, member.targets.monthly)} />
                        <p className="text-xs text-gray-500 mt-1">
                          of ${member.targets.monthly.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>Track leads through the sales process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-gray-500">{lead.company || 'No company'}</p>
                            <p className="text-xs text-gray-400">
                              {lead.email} • {lead.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {lead.estimatedBudget ? lead.estimatedBudget : 'Budget TBD'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(lead.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getLeadStatusColor(lead.status)}>
                            {lead.status.replace('-', ' ')}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Services Selected */}
                      {lead.services && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Services Requested:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(lead.services).filter(([_, selected]) => selected).map(([service, _]) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {getServiceDisplayName(service)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timeline Information */}
                      {lead.timeline && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Timeline:</p>
                          <div className="flex gap-4 text-sm text-gray-600">
                            {lead.timeline.desiredStartDate && (
                              <span>Start: {new Date(lead.timeline.desiredStartDate).toLocaleDateString()}</span>
                            )}
                            {lead.timeline.urgency && (
                              <span>Urgency: {lead.timeline.urgency}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Notes */}
                      {lead.additionalNotes && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {lead.additionalNotes}
                          </p>
                        </div>
                      )}

                      {/* Assignment */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="text-xs text-gray-500">
                          Assigned to: {lead.assigned_to || 'Unassigned'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last contact: {new Date(lead.last_contact).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="w-16 h-16" />
                  <span className="ml-2">Revenue Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion Funnel</CardTitle>
                <CardDescription>Lead conversion pipeline analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="w-16 h-16" />
                  <span className="ml-2">Funnel Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Rankings</CardTitle>
                <CardDescription>Performance leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 5)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{member.name}</span>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getPerformanceColor(member.performance)}`}>
                            {member.performance}%
                          </p>
                          <p className="text-xs text-gray-500">${member.commission.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Commission and achievement highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers
                    .filter(m => m.performance >= 100)
                    .map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{member.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">{member.performance}%</p>
                          <p className="text-xs text-gray-600">${member.commission.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Targets Management</CardTitle>
              <CardDescription>Set and track team and individual targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Target */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Team Monthly Target</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: ${metrics.totalRevenue.toLocaleString()}</span>
                    <span>Target: ${metrics.targetRevenue.toLocaleString()}</span>
                  </div>
                  <Progress value={getTargetProgress(metrics.totalRevenue, metrics.targetRevenue)} />
                  <p className="text-xs text-gray-500">
                    ${(metrics.targetRevenue - metrics.totalRevenue).toLocaleString()} remaining
                  </p>
                </div>
              </div>

              {/* Individual Targets */}
              <div>
                <h3 className="font-medium mb-3">Individual Targets</h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{member.name}</span>
                        <Badge className={getPerformanceColor(member.performance)}>
                          {member.performance}% achieved
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>${member.targets.achieved.toLocaleString()}</span>
                          <span>${member.targets.monthly.toLocaleString()}</span>
                        </div>
                        <Progress value={getTargetProgress(member.targets.achieved, member.targets.monthly)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Update Targets
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
