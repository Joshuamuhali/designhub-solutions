import React, { useEffect, useState } from 'react';
import { erpService, ERPInvoice } from '@/services/erpService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CheckCircle2, Clock, CreditCard, RefreshCw, FileText, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export default function FinanceManagement() {
  const [invoices, setInvoices] = useState<ERPInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    setLoading(true);
    const data = await erpService.getInvoices();
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleRecordPayment = async (invId: string, amount: number) => {
    const success = await erpService.recordPayment(invId, amount, 'mobile_money');
    if (success) {
      toast.success('Payment recorded successfully!');
      loadInvoices();
    }
  };

  const totalRevenue = invoices.reduce((acc, curr) => curr.status === 'paid' ? acc + curr.total_amount : acc, 0);
  const outstandingAmount = invoices.reduce((acc, curr) => curr.status === 'unpaid' ? acc + curr.total_amount : acc, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            Accounts & Finance Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage project invoices, mobile money payments, and revenue reconciliation.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadInvoices} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Accounts
        </Button>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Collected Revenue</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">K{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Outstanding Balances</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-600">K{outstandingAmount.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Invoices</p>
              <h3 className="text-2xl font-bold mt-1">{invoices.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <Card className="border-border bg-card">
        <CardHeader className="p-5">
          <CardTitle className="text-base font-bold">Project Invoices</CardTitle>
          <CardDescription className="text-xs">Generated automatically upon PM completion trigger.</CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 rounded-xl border border-border/80 bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/30">
                    {inv.invoice_number}
                  </Badge>
                  <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                    {inv.status}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-foreground">{inv.company_name || 'ABC Construction Ltd'}</h4>
                <p className="text-xs text-muted-foreground">Due Date: {inv.due_date || 'In 14 days'}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">K{inv.total_amount.toLocaleString()}</div>
                  <span className="text-[10px] text-muted-foreground">ZMW Total</span>
                </div>

                {inv.status === 'unpaid' && (
                  <Button
                    size="sm"
                    onClick={() => handleRecordPayment(inv.id, inv.total_amount)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Record Payment
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
