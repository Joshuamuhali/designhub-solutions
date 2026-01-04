import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  CreditCard,
  Calendar,
  TrendingUp,
  Users,
  Receipt
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Quote {
  id: string;
  project_name: string;
  service_type: string;
  amount: number;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  created_at: string;
  expires_at: string;
  description: string;
  items: QuoteItem[];
}

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Invoice {
  id: string;
  quote_id: string;
  project_name: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  paid_date?: string;
  payment_method?: string;
}

const statusConfig = {
  pending: { label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" /> },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: <FileText className="w-4 h-4" /> },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800', icon: <Receipt className="w-4 h-4" /> },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" /> }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Billing() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('quotes');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, [user]);

  const fetchBillingData = async () => {
    try {
      // Mock data for demonstration
      const mockQuotes: Quote[] = [
        {
          id: '1',
          project_name: 'Web Design Project',
          service_type: 'Web design',
          amount: 2500,
          status: 'pending',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Complete web design package with 5 pages',
          items: [
            {
              id: '1',
              name: 'Homepage Design',
              description: 'Custom homepage with hero section',
              quantity: 1,
              unit_price: 800,
              total: 800
            },
            {
              id: '2',
              name: 'Inner Pages',
              description: '4 additional pages with responsive design',
              quantity: 4,
              unit_price: 425,
              total: 1700
            }
          ]
        },
        {
          id: '2',
          project_name: 'Branding Package',
          service_type: 'Branding',
          amount: 1500,
          status: 'approved',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Complete branding identity package',
          items: [
            {
              id: '1',
              name: 'Logo Design',
              description: '3 logo concepts with revisions',
              quantity: 1,
              unit_price: 800,
              total: 800
            },
            {
              id: '2',
              name: 'Brand Guidelines',
              description: 'Complete brand style guide',
              quantity: 1,
              unit_price: 700,
              total: 700
            }
          ]
        }
      ];

      const mockInvoices: Invoice[] = [
        {
          id: '1',
          quote_id: '2',
          project_name: 'Branding Package',
          amount: 1500,
          status: 'paid',
          due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          paid_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          payment_method: 'Stripe'
        },
        {
          id: '2',
          quote_id: '1',
          project_name: 'Web Design Project',
          amount: 2500,
          status: 'sent',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setQuotes(mockQuotes);
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteAction = async (quoteId: string, action: 'approve' | 'decline') => {
    try {
      // Update quote status
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: action === 'approve' ? 'approved' : 'declined' }
          : quote
      ));

      toast.success(`Quote ${action === 'approve' ? 'approved' : 'declined'} successfully!`);

      // If approved, create invoice
      if (action === 'approve') {
        const quote = quotes.find(q => q.id === quoteId);
        if (quote) {
          const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            quote_id: quoteId,
            project_name: quote.project_name,
            amount: quote.amount,
            status: 'draft',
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString()
          };
          setInvoices(prev => [newInvoice, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      toast.error('Failed to update quote');
    }
  };

  const handlePayment = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowPaymentModal(true);
    }
  };

  const processPayment = async (paymentMethod: string) => {
    if (!selectedInvoice) return;

    try {
      // Update invoice status
      setInvoices(prev => prev.map(invoice => 
        invoice.id === selectedInvoice.id 
          ? { 
              ...invoice, 
              status: 'paid', 
              paid_date: new Date().toISOString(),
              payment_method: paymentMethod
            }
          : invoice
      ));

      toast.success('Payment processed successfully!');
      setShowPaymentModal(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    }
  };

  const downloadDocument = (type: 'quote' | 'invoice', id: string) => {
    // Mock download functionality
    toast.success(`${type === 'quote' ? 'Quote' : 'Invoice'} downloaded!`);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quotations & Invoices</h1>
        <p className="text-gray-600 mt-2">Manage your project quotes and payments.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter(q => q.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices
                  .filter(inv => inv.status !== 'paid')
                  .reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices
                  .filter(inv => inv.status === 'paid')
                  .reduce((sum, inv) => sum + inv.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'quotes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('quotes')}
          className="flex-1"
        >
          Quotes ({quotes.length})
        </Button>
        <Button
          variant={activeTab === 'invoices' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('invoices')}
          className="flex-1"
        >
          Invoices ({invoices.length})
        </Button>
      </div>

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>{quote.project_name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {quote.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(quote.amount)}</div>
                    <Badge className={statusConfig[quote.status].color}>
                      {statusConfig[quote.status].icon}
                      <span className="ml-1">{statusConfig[quote.status].label}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Service Type:</span>
                      <p className="font-medium">{quote.service_type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expires:</span>
                      <p className="font-medium">{formatDate(quote.expires_at)}</p>
                    </div>
                  </div>

                  {/* Quote Items */}
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">Quote Details</h4>
                    <div className="space-y-2">
                      {quote.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p>{item.quantity} × {formatCurrency(item.unit_price)}</p>
                            <p className="font-medium">{formatCurrency(item.total)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument('quote', quote.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuote(quote)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    {quote.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuoteAction(quote.id, 'decline')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleQuoteAction(quote.id, 'approve')}
                        >
                          Approve Quote
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Receipt className="w-5 h-5" />
                      <span>{invoice.project_name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Invoice #{invoice.id}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(invoice.amount)}</div>
                    <Badge className={statusConfig[invoice.status].color}>
                      {statusConfig[invoice.status].icon}
                      <span className="ml-1">{statusConfig[invoice.status].label}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">{formatDate(invoice.due_date)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <p className="font-medium">{formatDate(invoice.created_at)}</p>
                    </div>
                    {invoice.paid_date && (
                      <div>
                        <span className="text-gray-500">Paid Date:</span>
                        <p className="font-medium">{formatDate(invoice.paid_date)}</p>
                      </div>
                    )}
                    {invoice.payment_method && (
                      <div>
                        <span className="text-gray-500">Payment Method:</span>
                        <p className="font-medium">{invoice.payment_method}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument('invoice', invoice.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    {invoice.status !== 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => handlePayment(invoice.id)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>
                Pay {formatCurrency(selectedInvoice.amount)} for {selectedInvoice.project_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select onValueChange={(value) => processPayment(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Credit Card (Stripe)</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="momo">Mobile Money (Zambia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Process Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
