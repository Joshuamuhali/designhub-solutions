import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, 
  TrendingUp, 
  DollarSign,
  Users,
  Phone,
  Mail,
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Award,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getSalesMetrics,
  getLeads,
  getTasks,
  getCommissions,
  createRecord,
  updateRecord
} from '@/services/dashboardService';
import type { SalesMetrics, Lead, Task, Commission } from '@/services/dashboardService';

interface PersonalMetrics {
  monthlyTarget: number;
  achieved: number;
  commission: number;
  leadsAssigned: number;
  leadsConverted: number;
  pendingTasks: number;
  performance: number;
}

export default function SalesRepDashboard() {
  const [metrics, setMetrics] = useState<PersonalMetrics>({
    monthlyTarget: 0,
    achieved: 0,
    commission: 0,
    leadsAssigned: 0,
    leadsConverted: 0,
    pendingTasks: 0,
    performance: 0
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: 0,
    notes: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsData, leadsData, tasksData, commissionsData] = await Promise.all([
        getSalesMetrics(),
        getLeads('current-user-id'), // TODO: Get actual user ID
        getTasks('current-user-id'), // TODO: Get actual user ID
        getCommissions('current-user-id') // TODO: Get actual user ID
      ]);

      // Convert SalesMetrics to PersonalMetrics
      const personalMetrics: PersonalMetrics = {
        monthlyTarget: 50000, // TODO: Get from user profile
        achieved: metricsData.totalRevenue,
        commission: 0, // TODO: Calculate from commissions
        leadsAssigned: metricsData.totalLeads,
        leadsConverted: metricsData.convertedLeads,
        pendingTasks: tasksData.filter(t => t.status === 'pending').length,
        performance: metricsData.avgPerformance
      };

      setMetrics(personalMetrics);
      setLeads(leadsData);
      setTasks(tasksData);
      setCommissions(commissionsData);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTargetProgress = (achieved: number, target: number) => {
    return Math.min((achieved / target) * 100, 100);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadData = {
        name: newLead.name,
        company: newLead.company,
        email: newLead.email,
        phone: newLead.phone,
        value: newLead.value,
        status: 'new' as const,
        assigned_to: 'current-user-id', // TODO: Get actual user ID
        notes: newLead.notes,
        next_action: 'Initial contact required'
      };

      await createRecord('leads', leadData);
      toast.success('Lead created successfully');
      setShowNewLeadForm(false);
      setNewLead({
        name: '',
        company: '',
        email: '',
        phone: '',
        value: 0,
        notes: ''
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead');
    }
  };

  const conversionRate = metrics.leadsAssigned > 0 
    ? Math.round((metrics.leadsConverted / metrics.leadsAssigned) * 100)
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
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600">Your personal sales performance and activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowNewLeadForm(!showNewLeadForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Personal Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.achieved.toLocaleString()}</div>
            <Progress value={getTargetProgress(metrics.achieved, metrics.monthlyTarget)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              of ${metrics.monthlyTarget.toLocaleString()} target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.commission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month's earnings
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
              {metrics.leadsConverted} of {metrics.leadsAssigned} leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.performance)}`}>
              {metrics.performance}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall performance score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Lead Form */}
      {showNewLeadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Lead</CardTitle>
            <CardDescription>Enter lead information to add to your pipeline</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateLead}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Name</label>
                  <Input
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deal Value ($)</label>
                <Input
                  type="number"
                  value={newLead.value}
                  onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                  placeholder="Estimated deal value"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Additional notes about this lead"
                  rows={3}
                />
              </div>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6">
              <Button type="button" variant="outline" onClick={() => setShowNewLeadForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Lead</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads">My Leads</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* My Leads Tab */}
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Leads</CardTitle>
              <CardDescription>Manage your assigned leads and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-gray-500">{lead.company || 'No company'}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                              <Mail className="w-3 h-3" />
                              <span>{lead.email}</span>
                              <Phone className="w-3 h-3 ml-2" />
                              <span>{lead.phone}</span>
                            </div>
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
                      {(lead.additionalNotes || lead.notes) && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {lead.additionalNotes || lead.notes}
                          </p>
                        </div>
                      )}

                      {/* Next Action */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">{lead.next_action}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(lead.last_contact).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Your pending and completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Tab */}
        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tracking</CardTitle>
              <CardDescription>Your earned and pending commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{commission.client}</p>
                        <p className="text-sm text-gray-500">
                          Deal value: ${commission.deal_value.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(commission.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${commission.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Commission</p>
                      </div>
                      <Badge className={commission.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {commission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Commission:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${commissions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Your monthly sales trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <Activity className="w-16 h-16" />
                  <span className="ml-2">Performance Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion</CardTitle>
                <CardDescription>Your conversion funnel analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="w-16 h-16" />
                  <span className="ml-2">Conversion Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>Recent activities and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Leads converted this month</span>
                    <span className="font-bold text-green-600">{metrics.leadsConverted}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Average deal size</span>
                    <span className="font-bold">
                      ${Math.round(metrics.achieved / Math.max(metrics.leadsConverted, 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Tasks completed</span>
                    <span className="font-bold">
                      {tasks.filter(t => t.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals Progress</CardTitle>
                <CardDescription>Track your progress towards goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Target</span>
                      <span>{getTargetProgress(metrics.achieved, metrics.monthlyTarget)}%</span>
                    </div>
                    <Progress value={getTargetProgress(metrics.achieved, metrics.monthlyTarget)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lead Conversion</span>
                      <span>{conversionRate}%</span>
                    </div>
                    <Progress value={conversionRate} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Task Completion</span>
                      <span>
                        {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
