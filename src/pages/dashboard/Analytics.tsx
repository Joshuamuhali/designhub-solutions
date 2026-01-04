import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  totalRevenue: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  averageProjectValue: number;
  projectCompletionRate: number;
  monthlyGrowth: number;
  topServices: ServiceAnalytics[];
  revenueTrend: RevenueData[];
  projectStatusBreakdown: StatusData[];
}

interface ServiceAnalytics {
  service_type: string;
  count: number;
  revenue: number;
  growth: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  projects: number;
}

interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchAnalytics();
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data for demonstration
      const mockAnalytics: AnalyticsData = {
        totalRevenue: 45680,
        activeProjects: 8,
        completedProjects: 23,
        totalClients: 15,
        averageProjectValue: 1580,
        projectCompletionRate: 74.2,
        monthlyGrowth: 12.5,
        topServices: [
          { service_type: 'Web Design', count: 12, revenue: 18900, growth: 15.2 },
          { service_type: 'Branding', count: 8, revenue: 12400, growth: 8.7 },
          { service_type: 'Digital Marketing', count: 6, revenue: 9800, growth: 22.1 },
          { service_type: 'Video Production', count: 3, revenue: 4580, growth: -5.3 },
          { service_type: 'Sales & Lead Generation', count: 2, revenue: 0, growth: 0 }
        ],
        revenueTrend: [
          { month: 'Jan', revenue: 3200, projects: 2 },
          { month: 'Feb', revenue: 4800, projects: 3 },
          { month: 'Mar', revenue: 6200, projects: 4 },
          { month: 'Apr', revenue: 5800, projects: 3 },
          { month: 'May', revenue: 7400, projects: 5 },
          { month: 'Jun', revenue: 8900, projects: 6 },
          { month: 'Jul', revenue: 9280, projects: 7 }
        ],
        projectStatusBreakdown: [
          { status: 'completed', count: 23, percentage: 74.2 },
          { status: 'in_progress', count: 6, percentage: 19.4 },
          { status: 'pending', count: 2, percentage: 6.4 }
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Mock export functionality
    const reportData = {
      generated: new Date().toISOString(),
      timeRange,
      metrics: analytics
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">Track your business performance and insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
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
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {analytics.monthlyGrowth > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={analytics.monthlyGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {formatPercentage(analytics.monthlyGrowth)} from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(analytics.averageProjectValue)} avg. project value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.projectCompletionRate}%</div>
            <Progress value={analytics.projectCompletionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue and project volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenueTrend.map((data) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                          className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${(data.revenue / Math.max(...analytics.revenueTrend.map(d => d.revenue))) * 100}%`
                          }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(data.revenue)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-16 text-right">
                        {data.projects} projects
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Project Status</span>
            </CardTitle>
            <CardDescription>Current project distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.projectStatusBreakdown.map((status) => (
                <div key={status.status} className="flex items-center space-x-4">
                  <div className="w-24">
                    <Badge className={getStatusColor(status.status)}>
                      {status.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                          className={`h-6 rounded-full flex items-center justify-end pr-2 ${
                            status.status === 'completed' ? 'bg-green-500' :
                            status.status === 'in_progress' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${status.percentage}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {status.count} projects
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {status.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Top Performing Services</span>
          </CardTitle>
          <CardDescription>Revenue and performance by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topServices
              .filter(service => service.count > 0)
              .map((service, index) => (
                <div key={service.service_type} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{service.service_type}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{service.count} projects</span>
                        <span className="font-semibold">{formatCurrency(service.revenue)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(service.revenue / Math.max(...analytics.topServices.map(s => s.revenue))) * 100}%`
                          }}
                        />
                      </div>
                      <div className={`flex items-center space-x-1 text-xs ${
                        service.growth > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {service.growth > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{formatPercentage(service.growth)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Performance Insights</span>
          </CardTitle>
          <CardDescription>Key observations and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h3 className="font-medium text-green-800 mb-1">Strong Performance</h3>
              <p className="text-sm text-green-700">
                Digital Marketing shows the highest growth at {formatPercentage(analytics.topServices[2].growth)}. 
                Consider expanding this service offering.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-1">Opportunity</h3>
              <p className="text-sm text-blue-700">
                Web Design remains your top revenue driver. Focus on upselling additional services to existing clients.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h3 className="font-medium text-yellow-800 mb-1">Watch List</h3>
              <p className="text-sm text-yellow-700">
                Video Production shows declining growth. Review pricing and marketing strategy for this service.
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h3 className="font-medium text-purple-800 mb-1">Efficiency</h3>
              <p className="text-sm text-purple-700">
                {analytics.projectCompletionRate}% project completion rate is excellent. Maintain current workflow processes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
