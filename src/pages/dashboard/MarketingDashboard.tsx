import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Eye,
  MousePointer,
  Target,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Activity,
  Megaphone,
  Mail,
  Phone,
  Globe,
  Download
} from 'lucide-react';

interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  totalSpent: number;
  totalRevenue: number;
  roi: number;
  avgEngagement: number;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content' | 'seo';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  revenue: number;
  start_date: string;
  end_date?: string;
  description: string;
}

interface LeadSource {
  source: string;
  leads: number;
  cost_per_lead: number;
  conversion_rate: number;
  revenue: number;
}

interface Content {
  id: string;
  title: string;
  type: 'blog' | 'video' | 'infographic' | 'social' | 'email';
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  engagement: number;
  leads_generated: number;
  published_date: string;
}

export default function MarketingDashboard() {
  const [metrics, setMetrics] = useState<CampaignMetrics>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalLeads: 0,
    conversionRate: 0,
    totalSpent: 0,
    totalRevenue: 0,
    roi: 0,
    avgEngagement: 0
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setMetrics({
        totalCampaigns: 24,
        activeCampaigns: 8,
        totalLeads: 1847,
        conversionRate: 12.5,
        totalSpent: 45000,
        totalRevenue: 285000,
        roi: 533,
        avgEngagement: 68
      });

      setCampaigns([
        {
          id: '1',
          name: 'Q1 Email Campaign',
          type: 'email',
          status: 'active',
          budget: 10000,
          spent: 7500,
          leads: 342,
          conversions: 45,
          revenue: 67500,
          start_date: '2025-01-01',
          end_date: '2025-03-31',
          description: 'Targeted email campaign for Q1 promotions'
        },
        {
          id: '2',
          name: 'Social Media Awareness',
          type: 'social',
          status: 'active',
          budget: 8000,
          spent: 6200,
          leads: 289,
          conversions: 28,
          revenue: 42000,
          start_date: '2025-01-15',
          description: 'Brand awareness campaign across social platforms'
        },
        {
          id: '3',
          name: 'Google Ads Lead Gen',
          type: 'ppc',
          status: 'active',
          budget: 15000,
          spent: 12300,
          leads: 456,
          conversions: 67,
          revenue: 98000,
          start_date: '2025-01-01',
          description: 'PPC campaign focused on lead generation'
        }
      ]);

      setLeadSources([
        {
          source: 'Google Ads',
          leads: 456,
          cost_per_lead: 27,
          conversion_rate: 14.7,
          revenue: 98000
        },
        {
          source: 'Email Marketing',
          leads: 342,
          cost_per_lead: 22,
          conversion_rate: 13.2,
          revenue: 67500
        },
        {
          source: 'Social Media',
          leads: 289,
          cost_per_lead: 21,
          conversion_rate: 9.7,
          revenue: 42000
        },
        {
          source: 'Organic Search',
          leads: 198,
          cost_per_lead: 0,
          conversion_rate: 18.3,
          revenue: 35000
        },
        {
          source: 'Referrals',
          leads: 156,
          cost_per_lead: 0,
          conversion_rate: 22.1,
          revenue: 28000
        }
      ]);

      setContent([
        {
          id: '1',
          title: '10 Ways to Improve Your Digital Marketing',
          type: 'blog',
          status: 'published',
          views: 5420,
          engagement: 72,
          leads_generated: 89,
          published_date: '2025-01-03'
        },
        {
          id: '2',
          title: 'Product Demo Video',
          type: 'video',
          status: 'published',
          views: 12300,
          engagement: 68,
          leads_generated: 156,
          published_date: '2025-01-01'
        },
        {
          id: '3',
          title: 'Marketing Statistics 2025',
          type: 'infographic',
          status: 'published',
          views: 8900,
          engagement: 85,
          leads_generated: 134,
          published_date: '2024-12-28'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'ppc': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-orange-100 text-orange-800';
      case 'seo': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'infographic': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getROI = (revenue: number, spent: number) => {
    if (spent === 0) return 0;
    return Math.round(((revenue - spent) / spent) * 100);
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
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600">Campaign performance and lead generation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeCampaigns} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.roi}%</div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgEngagement}%</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${metrics.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Marketing investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From marketing efforts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Lead</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(metrics.totalSpent / metrics.totalLeads)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average cost per acquisition
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="leads">Lead Sources</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Monitor and manage your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-600">{campaign.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(campaign.start_date).toLocaleDateString()} - 
                          {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${campaign.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{campaign.leads}</p>
                        <p className="text-xs text-gray-500">Leads</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{getROI(campaign.revenue, campaign.spent)}%</p>
                        <p className="text-xs text-gray-500">ROI</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getCampaignTypeColor(campaign.type)}>
                          {campaign.type}
                        </Badge>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Sources Tab */}
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources Analysis</CardTitle>
              <CardDescription>Performance breakdown by lead source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{source.source}</p>
                        <p className="text-sm text-gray-600">
                          {source.leads} leads • ${source.cost_per_lead} per lead
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${source.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{source.conversion_rate}%</p>
                        <p className="text-xs text-gray-500">Conv. Rate</p>
                      </div>
                      <div className="w-24">
                        <Progress value={source.conversion_rate} className="mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Track your content marketing efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          Published {new Date(item.published_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.views.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.engagement}%</p>
                        <p className="text-xs text-gray-500">Engagement</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.leads_generated}</p>
                        <p className="text-xs text-gray-500">Leads</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getContentTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
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
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>ROI and conversion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="w-16 h-16" />
                  <span className="ml-2">Performance Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Sources Breakdown</CardTitle>
                <CardDescription>Distribution by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <PieChart className="w-16 h-16" />
                  <span className="ml-2">Source Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Content engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="w-16 h-16" />
                  <span className="ml-2">Engagement Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead to customer conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Visitors</span>
                    <span className="font-bold">25,430</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Leads</span>
                    <span className="font-bold">{metrics.totalLeads}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Qualified Leads</span>
                    <span className="font-bold">892</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Customers</span>
                    <span className="font-bold">231</span>
                  </div>
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
                <CardTitle>Monthly Marketing Report</CardTitle>
                <CardDescription>Comprehensive monthly performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium mb-2">Key Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Campaigns:</span>
                        <span className="font-bold">{metrics.totalCampaigns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Leads:</span>
                        <span className="font-bold">{metrics.totalLeads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion Rate:</span>
                        <span className="font-bold">{metrics.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI:</span>
                        <span className="font-bold text-green-600">{metrics.roi}%</span>
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
                <CardTitle>Campaign Comparison</CardTitle>
                <CardDescription>Side-by-side campaign analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="w-16 h-16" />
                  <span className="ml-2">Comparison Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Best content pieces this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content
                    .sort((a, b) => b.leads_generated - a.leads_generated)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            'bg-orange-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{item.leads_generated} leads</p>
                          <p className="text-xs text-gray-500">{item.engagement}% engagement</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
                <CardDescription>Spend vs allocated budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{campaign.name}</span>
                        <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
