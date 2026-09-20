import { supabase } from '@/lib/supabase';

export interface BenefitItem {
  title: string;
  desc: string;
}

export interface FeatureItem {
  title: string;
  desc: string;
}

export interface ProcessItem {
  step: number;
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ImageItem {
  url: string;
  caption?: string;
}

export interface OfferingItem {
  id: string;
  name: string;
  slug: string;
  type: 'service' | 'product';
  category: string;
  short_description: string;
  full_description?: string;
  price?: number;
  price_type: 'fixed' | 'starting_at' | 'range' | 'custom';
  pricing_details?: string;
  turnaround_time?: string;
  intake_status?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  problem_statement?: string;
  solution_statement?: string;
  benefits?: BenefitItem[];
  features?: FeatureItem[];
  process?: ProcessItem[];
  faqs?: FAQItem[];
  images?: ImageItem[];
  cta_text?: string;
  seo_title?: string;
  seo_description?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpressInterestPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  offering_type: 'service' | 'product' | 'general';
  offering_id?: string;
  offering_slug: string;
  offering_name: string;
  estimatedBudget?: string;
  quantity?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}


export const offeringService = {
  // Fetch all published services
  async getPublishedServices(): Promise<OfferingItem[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[offering] getPublishedServices failed:', error);
        throw new Error(`Failed to load services: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(item => ({ ...item, type: 'service' }));
    } catch (err: any) {
      console.error('[offering] getPublishedServices error:', err);
      throw new Error(`Failed to load services: ${err.message}`);
    }
  },

  // Fetch all published products
  async getPublishedProducts(): Promise<OfferingItem[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[offering] getPublishedProducts failed:', error);
        throw new Error(`Failed to load products: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(item => ({ ...item, type: 'product' }));
    } catch (err: any) {
      console.error('[offering] getPublishedProducts error:', err);
      throw new Error(`Failed to load products: ${err.message}`);
    }
  },

  // Fetch offering by slug and type
  async getOfferingBySlug(slug: string, type: 'service' | 'product'): Promise<OfferingItem | null> {
    try {
      const table = type === 'service' ? 'services' : 'products';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('[offering] getOfferingBySlug failed:', error);
        throw new Error(`Failed to load offering: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return { ...data, type };
    } catch (err: any) {
      console.error('[offering] getOfferingBySlug error:', err);
      throw new Error(`Failed to load offering: ${err.message}`);
    }
  },

  // Admin: Get all offerings (including drafts)
  async getAllOfferings(): Promise<{ services: OfferingItem[]; products: OfferingItem[] }> {
    try {
      const { data: servicesData, error: servicesError } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (servicesError) {
        console.error('[offering] getAllOfferings services failed:', servicesError);
        throw new Error(`Failed to load services: ${servicesError.message}`);
      }

      const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsError) {
        console.error('[offering] getAllOfferings products failed:', productsError);
        throw new Error(`Failed to load products: ${productsError.message}`);
      }

      const services = (servicesData || []).map(s => ({ ...s, type: 'service' as const }));
      const products = (productsData || []).map(p => ({ ...p, type: 'product' as const }));

      return { services, products };
    } catch (err: any) {
      console.error('[offering] getAllOfferings error:', err);
      throw new Error(`Failed to load offerings: ${err.message}`);
    }
  },

  // Admin: Create or update offering
  async saveOffering(offering: Partial<OfferingItem> & { type: 'service' | 'product' }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const table = offering.type === 'service' ? 'services' : 'products';
      const payload: any = {
        name: offering.name,
        slug: offering.slug || offering.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: offering.category || 'digital',
        short_description: offering.short_description || '',
        full_description: offering.full_description,
        price: offering.price,
        price_type: offering.price_type || 'starting_at',
        pricing_details: offering.pricing_details,
        turnaround_time: offering.turnaround_time || '5-7 business days',
        intake_status: offering.intake_status || 'Open for Intake',
        hero_headline: offering.hero_headline,
        hero_subheadline: offering.hero_subheadline,
        problem_statement: offering.problem_statement,
        solution_statement: offering.solution_statement,
        benefits: offering.benefits || [],
        features: offering.features || [],
        process: offering.process || [],
        faqs: offering.faqs || [],
        cta_text: offering.cta_text || 'Express Interest',
        status: offering.status || 'published',
        updated_at: new Date().toISOString()
      };

      if (offering.id && !offering.id.startsWith('srv-') && !offering.id.startsWith('prd-')) {
        const { data, error } = await supabase.from(table).update(payload).eq('id', offering.id).select().single();
        if (error) throw error;
        return { success: true, data };
      } else {
        payload.created_at = new Date().toISOString();
        const { data, error } = await supabase.from(table).insert(payload).select().single();
        if (error) throw error;
        return { success: true, data };
      }
    } catch (err: any) {
      console.error('Error saving offering:', err);
      return { success: false, error: err.message || 'Failed to save offering' };
    }
  },

  // Submit Express Interest -> Creates lead directly in Supabase CRM
  async submitExpressInterest(payload: ExpressInterestPayload): Promise<{ success: boolean; leadId?: string; error?: string }> {
    try {
      console.log('🚀 Express Interest submitted:', payload);
      
      const leadPayload = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        company: payload.company || 'Not Specified',
        notes: `Interested in ${payload.offering_name} (${payload.offering_type}). ${payload.message ? 'Message: ' + payload.message : ''}`,
        estimatedBudget: payload.estimatedBudget || (payload.offering_type === 'product' && payload.quantity ? `Qty: ${payload.quantity}` : 'Consultation requested'),
        status: 'new',
        assigned_to: 'unassigned',
        next_action: 'Contact lead regarding interest in ' + payload.offering_name,
        created_at: new Date().toISOString(),
        last_contact: new Date().toISOString(),
        // Attribution metadata
        offering_type: payload.offering_type,
        offering_id: payload.offering_id || null,
        offering_slug: payload.offering_slug,
        landing_page: `/${payload.offering_type === 'service' ? 'services' : 'products'}/${payload.offering_slug}`,
        utm_source: payload.utm_source || 'website_landing_page',
        utm_medium: payload.utm_medium || 'express_interest_form',
        utm_campaign: payload.utm_campaign || 'direct_landing'
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(leadPayload as any)
        .select('id')
        .single();

      if (error) {
        console.error('[offering] submitExpressInterest failed:', error);
        throw new Error(`Failed to submit interest: ${error.message}`);
      }

      return { success: true, leadId: data?.id || 'LD-CONFIRMED' };
    } catch (err: any) {
      console.error('[offering] submitExpressInterest error:', err);
      throw new Error(`Failed to submit interest: ${err.message}`);
    }
  }
};
