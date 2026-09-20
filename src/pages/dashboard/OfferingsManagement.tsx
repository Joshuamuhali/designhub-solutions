import React, { useState } from 'react';
import { useAllOfferings, useSaveOffering } from '@/hooks/useOffering';
import type { OfferingItem } from '@/services/offeringService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Clock,
  CheckCircle,
  Eye,
  Layers,
  ShoppingBag,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function OfferingsManagement() {
  const { data: offeringsData, isLoading, refetch } = useAllOfferings();
  const saveOffering = useSaveOffering();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'products'>('all');

  // Modal State for Edit/Create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<OfferingItem> | null>(null);

  const services = offeringsData?.services || [];
  const products = offeringsData?.products || [];

  const handleOpenCreate = (type: 'service' | 'product') => {
    setEditingItem({
      type,
      name: '',
      slug: '',
      category: type === 'service' ? 'digital' : 'branding',
      short_description: '',
      full_description: '',
      price: 1500,
      price_type: 'starting_at',
      pricing_details: '',
      turnaround_time: '5-7 business days',
      intake_status: 'Open for Intake',
      hero_headline: '',
      hero_subheadline: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: OfferingItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.type) return;

    saveOffering.mutate(editingItem as any, {
      onSuccess: () => {
        toast.success(`${editingItem.type === 'service' ? 'Service' : 'Product'} saved successfully!`);
        setIsModalOpen(false);
        setEditingItem(null);
        refetch();
      },
      onError: (error: any) => {
        toast.error(`Error saving: ${error.message}`);
      }
    });
  };

  const handleToggleStatus = async (item: OfferingItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const updated = { ...item, status: newStatus as any };
    saveOffering.mutate(updated, {
      onSuccess: () => {
        toast.success(`Status updated to ${newStatus}`);
        refetch();
      }
    });
  };

  const allOfferings = [...services, ...products];
  const filteredOfferings = allOfferings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'services') return matchesSearch && item.type === 'service';
    if (activeTab === 'products') return matchesSearch && item.type === 'product';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            CRM Products & Services Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your catalog offerings. Published offerings automatically render dynamic public landing pages (`/services/:slug` or `/products/:slug`).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => handleOpenCreate('service')} className="gap-1.5 text-xs font-semibold">
            <Plus className="w-4 h-4" /> Add Service
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleOpenCreate('product')} className="gap-1.5 text-xs font-semibold">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Offerings</p>
              <h3 className="text-2xl font-bold mt-1">{allOfferings.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Published Services</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">
                {services.filter(s => s.status === 'published').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Published Products</p>
              <h3 className="text-2xl font-bold mt-1 text-sky-600">
                {products.filter(p => p.status === 'published').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs">All ({allOfferings.length})</TabsTrigger>
            <TabsTrigger value="services" className="text-xs">Services ({services.length})</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products ({products.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search offerings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Offerings Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground mt-2">Loading CRM offerings...</p>
        </div>
      ) : filteredOfferings.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold">No offerings found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search filter or create a new offering.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfferings.map((item) => {
            const landingUrl = `/${item.type === 'service' ? 'services' : 'products'}/${item.slug}`;
            return (
              <Card key={item.id} className="border-border hover:border-primary/40 transition-all bg-card flex flex-col justify-between">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {item.type}
                    </Badge>
                    <Badge
                      variant={item.status === 'published' ? 'default' : 'secondary'}
                      className={`text-[10px] cursor-pointer ${
                        item.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''
                      }`}
                      onClick={() => handleToggleStatus(item)}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground line-clamp-1">{item.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">{item.short_description}</CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <div className="flex items-center justify-between text-xs border-t border-b border-border/60 py-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-foreground">
                      {item.price ? `K${item.price.toLocaleString()}` : 'Custom'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.turnaround_time || '5-7 days'}
                    </span>
                    <span className="font-mono text-[10px]">/{item.slug}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(landingUrl, '_blank')}
                      className="text-xs h-8 gap-1.5 flex-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Landing
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      className="text-xs h-8 gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit / Create Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingItem?.id ? 'Edit Offering Record' : `Create New ${editingItem?.type === 'service' ? 'Service' : 'Product'}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configuring this CRM record automatically creates and updates its live landing page.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Offering Name *</Label>
                  <Input
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Website Design"
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">URL Slug *</Label>
                  <Input
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="e.g. web-design"
                    required
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Type</Label>
                  <Select
                    value={editingItem.type || 'service'}
                    onValueChange={(val: any) => setEditingItem({ ...editingItem, type: val })}
                  >
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Category</Label>
                  <Input
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="e.g. digital"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Status</Label>
                  <Select
                    value={editingItem.status || 'published'}
                    onValueChange={(val: any) => setEditingItem({ ...editingItem, status: val })}
                  >
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Price (ZMW)</Label>
                  <Input
                    type="number"
                    value={editingItem.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    placeholder="4500"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Turnaround Time</Label>
                  <Input
                    value={editingItem.turnaround_time || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, turnaround_time: e.target.value })}
                    placeholder="5-7 business days"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Intake Status</Label>
                  <Input
                    value={editingItem.intake_status || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, intake_status: e.target.value })}
                    placeholder="Open for Intake"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Short Summary Description *</Label>
                <Textarea
                  value={editingItem.short_description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, short_description: e.target.value })}
                  placeholder="Summary for cards and meta descriptions..."
                  className="min-h-[60px] text-xs resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Landing Hero Headline</Label>
                <Input
                  value={editingItem.hero_headline || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, hero_headline: e.target.value })}
                  placeholder="e.g. Your Business Needs More Than a Website."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Problem Statement</Label>
                <Textarea
                  value={editingItem.problem_statement || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, problem_statement: e.target.value })}
                  placeholder="Describe the challenge your prospective clients face..."
                  className="min-h-[60px] text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Solution Statement</Label>
                <Textarea
                  value={editingItem.solution_statement || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, solution_statement: e.target.value })}
                  placeholder="Explain how Designhub delivers results..."
                  className="min-h-[60px] text-xs resize-none"
                />
              </div>

              <DialogFooter className="pt-4 border-t border-border">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saveOffering.isPending} className="gap-2">
                  {saveOffering.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Offering Record
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
