import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MessageSquare, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  Send,
  Eye,
  Plus,
  Filter,
  Calendar,
  Star,
  Activity,
  Download
} from 'lucide-react';

interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  ticketsToday: number;
  escalatedTickets: number;
}

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  customer: string;
  customer_email: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  description: string;
  customer_rating?: number;
}

interface SupportAgent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
  tickets_assigned: number;
  tickets_resolved: number;
  avg_response_time: number;
  customer_rating: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  total_tickets: number;
  open_tickets: number;
  satisfaction_score: number;
  last_contact: string;
}

export default function SupportDashboard() {
  const [metrics, setMetrics] = useState<SupportMetrics>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0,
    customerSatisfaction: 0,
    ticketsToday: 0,
    escalatedTickets: 0
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setMetrics({
        totalTickets: 1247,
        openTickets: 89,
        resolvedTickets: 1158,
        avgResponseTime: 2.5, // in hours
        avgResolutionTime: 8.3, // in hours
        customerSatisfaction: 4.6,
        ticketsToday: 34,
        escalatedTickets: 5
      });

      setTickets([
        {
          id: '1',
          ticket_number: 'TKT-2025-001',
          subject: 'Unable to access dashboard',
          customer: 'John Doe',
          customer_email: 'john@company.com',
          priority: 'high',
          status: 'open',
          category: 'technical',
          assigned_to: 'Sarah Johnson',
          created_at: '2025-01-04T09:30:00Z',
          updated_at: '2025-01-04T10:15:00Z',
          due_date: '2025-01-05T17:00:00Z',
          description: 'Customer cannot access their dashboard after recent update'
        },
        {
          id: '2',
          ticket_number: 'TKT-2025-002',
          subject: 'Billing inquiry',
          customer: 'Jane Smith',
          customer_email: 'jane@company.com',
          priority: 'medium',
          status: 'in_progress',
          category: 'billing',
          assigned_to: 'Mike Wilson',
          created_at: '2025-01-04T08:45:00Z',
          updated_at: '2025-01-04T11:30:00Z',
          description: 'Question about recent invoice charges'
        },
        {
          id: '3',
          ticket_number: 'TKT-2025-003',
          subject: 'Feature request for reporting',
          customer: 'Bob Johnson',
          customer_email: 'bob@company.com',
          priority: 'low',
          status: 'resolved',
          category: 'feature_request',
          created_at: '2025-01-03T14:20:00Z',
          updated_at: '2025-01-04T09:00:00Z',
          description: 'Request for additional reporting features',
          customer_rating: 5
        }
      ]);

      setAgents([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          status: 'online',
          tickets_assigned: 12,
          tickets_resolved: 45,
          avg_response_time: 1.8,
          customer_rating: 4.8
        },
        {
          id: '2',
          name: 'Mike Wilson',
          email: 'mike@company.com',
          status: 'busy',
          tickets_assigned: 8,
          tickets_resolved: 32,
          avg_response_time: 2.2,
          customer_rating: 4.6
        },
        {
          id: '3',
          name: 'Emily Davis',
          email: 'emily@company.com',
          status: 'online',
          tickets_assigned: 15,
          tickets_resolved: 28,
          avg_response_time: 3.1,
          customer_rating: 4.4
        }
      ]);

      setCustomers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@company.com',
          company: 'ABC Corporation',
          total_tickets: 12,
          open_tickets: 2,
          satisfaction_score: 4.2,
          last_contact: '2025-01-04T10:15:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@company.com',
          company: 'XYZ Industries',
          total_tickets: 8,
          open_tickets: 1,
          satisfaction_score: 4.8,
          last_contact: '2025-01-04T11:30:00Z'
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@company.com',
          total_tickets: 5,
          open_tickets: 0,
          satisfaction_score: 4.6,
          last_contact: '2025-01-03T14:20:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'billing': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'feature_request': return 'bg-green-100 text-green-800';
      case 'bug_report': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAssignTicket = (ticketId: string, agentId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, assigned_to: agents.find(a => a.id === agentId)?.name }
        : ticket
    ));
  };

  const handleUpdateTicketStatus = (ticketId: string, status: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: status as any, updated_at: new Date().toISOString() }
        : ticket
    ));
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Customer Support Dashboard</h1>
          <p className="text-gray-600">Ticket management and customer satisfaction</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Support Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.ticketsToday} new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}h</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSatisfactionColor(metrics.customerSatisfaction)}`}>
              {metrics.customerSatisfaction}
            </div>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(metrics.customerSatisfaction)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">
              Total resolved tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.escalatedTickets}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResolutionTime}h</div>
            <p className="text-xs text-muted-foreground">
              Average resolution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              All time tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage and track customer support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{ticket.ticket_number}</p>
                        <p className="text-sm text-gray-600">{ticket.subject}</p>
                        <p className="text-xs text-gray-500">
                          {ticket.customer} • {ticket.customer_email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{ticket.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {ticket.assigned_to || 'Unassigned'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                        {ticket.due_date && (
                          <p className="text-xs text-orange-600">
                            Due {new Date(ticket.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getCategoryColor(ticket.category)}>
                          {ticket.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      {ticket.customer_rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{ticket.customer_rating}</span>
                        </div>
                      )}
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Agents</CardTitle>
              <CardDescription>Agent performance and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getAgentStatusColor(agent.status)}>
                            {agent.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {agent.avg_response_time}h avg response
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{agent.tickets_assigned}</p>
                        <p className="text-xs text-gray-500">Assigned</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{agent.tickets_resolved}</p>
                        <p className="text-xs text-gray-500">Resolved</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className={`text-sm font-bold ${getSatisfactionColor(agent.customer_rating)}`}>
                            {agent.customer_rating}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Rating</p>
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

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>Customer satisfaction and ticket history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        {customer.company && (
                          <p className="text-xs text-gray-500">{customer.company}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Last contact: {new Date(customer.last_contact).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{customer.total_tickets}</p>
                        <p className="text-xs text-gray-500">Total tickets</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{customer.open_tickets}</p>
                        <p className="text-xs text-gray-500">Open tickets</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className={`text-sm font-bold ${getSatisfactionColor(customer.satisfaction_score)}`}>
                          {customer.satisfaction_score}
                        </span>
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Volume Trends</CardTitle>
                <CardDescription>Ticket volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="w-16 h-16" />
                  <span className="ml-2">Volume Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
                <CardDescription>Response and resolution time trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <Clock className="w-16 h-16" />
                  <span className="ml-2">Response Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Tickets by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Technical</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Billing</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">General</span>
                    <span className="font-bold">20%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Feature Request</span>
                    <span className="font-bold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Performance leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents
                    .sort((a, b) => b.tickets_resolved - a.tickets_resolved)
                    .slice(0, 5)
                    .map((agent, index) => (
                      <div key={agent.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{agent.tickets_resolved}</p>
                          <p className="text-xs text-gray-500">
                            <Star className="w-3 h-3 inline text-yellow-400" />
                            {agent.customer_rating}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Support Report</CardTitle>
                <CardDescription>Today's support performance summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium mb-2">Today's Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>New Tickets:</span>
                        <span className="font-bold">{metrics.ticketsToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolved:</span>
                        <span className="font-bold text-green-600">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Response Time:</span>
                        <span className="font-bold">{metrics.avgResponseTime}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction:</span>
                        <span className={`font-bold ${getSatisfactionColor(metrics.customerSatisfaction)}`}>
                          {metrics.customerSatisfaction}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Customer satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="w-16 h-16" />
                  <span className="ml-2">Satisfaction Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Tickets by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Urgent</span>
                    <span className="font-bold text-red-600">5</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">High</span>
                    <span className="font-bold text-orange-600">23</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Medium</span>
                    <span className="font-bold text-yellow-600">41</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Low</span>
                    <span className="font-bold text-green-600">20</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Issues</CardTitle>
                <CardDescription>Most common support issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Login Issues</span>
                    <span className="font-bold">34</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Billing Questions</span>
                    <span className="font-bold">28</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Feature Requests</span>
                    <span className="font-bold">19</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Bug Reports</span>
                    <span className="font-bold">15</span>
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
