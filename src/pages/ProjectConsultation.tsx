import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle, LogIn, Upload, ChevronRight, CheckCircle, Sparkles } from "lucide-react";
import { createRecord, createProductInquiryLead } from "@/services/dashboardService";
import { useAuth } from "@/contexts/AuthContext";
import { PRODUCTS, PRODUCT_CATEGORIES, Product } from "@/data/products";

interface FormData {
  // Contact Info
  fullName: string;
  company: string;
  email: string;
  phone: string;
  
  // Service Selection
  services: {
    webDesign: boolean;
    digitalMarketing: boolean;
    branding: boolean;
    videoProduction: boolean;
    salesLeadGen: boolean;
    strategyConsulting: boolean;
  };
  
  // Web Design Fields
  webDesign: {
    websiteType: string;
    numberOfPages: string;
    cmsEcommerce: string;
    specialFeatures: string;
    paymentIntegration: string;
    inventory: string;
    productCatalog: string;
  };
  
  // Digital Marketing Fields
  digitalMarketing: {
    package: string;
    channels: {
      socialMedia: boolean;
      ads: boolean;
      seo: boolean;
      email: boolean;
    };
    monthlyBudget: string;
    goal: string;
    adBudget: string;
    targetAudience: string;
    campaignDuration: string;
  };
  
  // Branding Fields
  branding: {
    serviceType: string;
    printMaterials: string;
    brandGuidelines: string;
    additionalNotes: string;
    brochures: string;
    businessCards: string;
    packaging: string;
    socialMediaKit: string;
  };
  
  // Video Production Fields
  videoProduction: {
    type: string;
    length: string;
    socialMediaReady: string;
    scriptNeeded: string;
    storyboard: string;
    voiceTalent: string;
    music: string;
    subtitles: string;
  };
  
  // Sales & Lead Generation Fields
  salesLeadGen: {
    type: string;
    monthlyBudget: string;
    leadSourcePreferences: {
      online: boolean;
      offline: boolean;
      both: boolean;
    };
    targetMarket: string;
    adSpend: string;
    funnelStages: string;
    kpis: string;
    reportingFrequency: string;
  };
  
  // Strategy & Consulting Fields
  strategyConsulting: {
    type: string;
    duration: string;
    focusAreas: string;
    teamSize: string;
    department: string;
    learningGoals: string;
  };
  
  // Timeline & Budget
  desiredStartDate: string;
  estimatedBudget: string;
  urgency: string;
  
  // Additional
  additionalNotes: string;
  uploadedFiles: File[];
}

const ProjectConsultation = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>(searchParams.get("product") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");

  const [formData, setFormData] = useState<FormData>({
    // Contact Info
    fullName: user?.user_metadata?.full_name || "",
    company: "",
    email: user?.email || "",
    phone: "",
    
    // Service Selection
    services: {
      webDesign: false,
      digitalMarketing: false,
      branding: false,
      videoProduction: false,
      salesLeadGen: false,
      strategyConsulting: false,
    },
    
    // Web Design Fields
    webDesign: {
      websiteType: "",
      numberOfPages: "",
      cmsEcommerce: "",
      specialFeatures: "",
      paymentIntegration: "",
      inventory: "",
      productCatalog: "",
    },
    
    // Digital Marketing Fields
    digitalMarketing: {
      package: "",
      channels: {
        socialMedia: false,
        ads: false,
        seo: false,
        email: false,
      },
      monthlyBudget: "",
      goal: "",
      adBudget: "",
      targetAudience: "",
      campaignDuration: "",
    },
    
    // Branding Fields
    branding: {
      serviceType: "",
      printMaterials: "",
      brandGuidelines: "",
      additionalNotes: "",
      brochures: "",
      businessCards: "",
      packaging: "",
      socialMediaKit: "",
    },
    
    // Video Production Fields
    videoProduction: {
      type: "",
      length: "",
      socialMediaReady: "",
      scriptNeeded: "",
      storyboard: "",
      voiceTalent: "",
      music: "",
      subtitles: "",
    },
    
    // Sales & Lead Generation Fields
    salesLeadGen: {
      type: "",
      monthlyBudget: "",
      leadSourcePreferences: {
        online: false,
        offline: false,
        both: false,
      },
      targetMarket: "",
      adSpend: "",
      funnelStages: "",
      kpis: "",
      reportingFrequency: "",
    },
    
    // Strategy & Consulting Fields
    strategyConsulting: {
      type: "",
      duration: "",
      focusAreas: "",
      teamSize: "",
      department: "",
      learningGoals: "",
    },
    
    // Timeline & Budget
    desiredStartDate: "",
    estimatedBudget: "",
    urgency: "",
    
    // Additional
    additionalNotes: "",
    uploadedFiles: [],
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (service: keyof typeof formData.services, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked
      }
    }));
  };

  const handleNestedChange = (category: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof FormData] as any),
        [field]: value
      }
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== files.length) {
      toast({
        title: "File size limit",
        description: "Some files were too large. Maximum file size is 10MB.",
        variant: "destructive"
      });
    }
    
    setFormData(prev => ({
      ...prev,
      uploadedFiles: validFiles
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required contact information.",
        variant: "destructive"
      });
      return false;
    }

    const hasSelectedService = Object.values(formData.services).some(Boolean);
    if (!hasSelectedService) {
      toast({
        title: "No service selected",
        description: "Please select at least one service.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const selectedProdObj = selectedProduct ? PRODUCTS.find(p => p.id === selectedProduct) : null;
      const selectedCatObj = selectedCategory ? PRODUCT_CATEGORIES.find(c => c.id === selectedCategory) : null;

      await createProductInquiryLead({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        productId: selectedProdObj?.id || '',
        productName: selectedProdObj?.name || '',
        categoryId: selectedCatObj?.id || selectedProdObj?.categoryId || '',
        categoryTitle: selectedCatObj?.title || selectedProdObj?.categoryName || 'General Solution',
        priceAnchor: selectedProdObj?.price || formData.estimatedBudget || 'N/A',
        services: formData.services,
        projectDetails: {
          webDesign: formData.webDesign,
          digitalMarketing: formData.digitalMarketing,
          branding: formData.branding,
          videoProduction: formData.videoProduction,
          salesLeadGen: formData.salesLeadGen,
          strategyConsulting: formData.strategyConsulting,
        },
        timeline: {
          desiredStartDate: formData.desiredStartDate,
          estimatedBudget: formData.estimatedBudget,
          urgency: formData.urgency,
        },
        additionalNotes: formData.additionalNotes,
        user_id: user?.id || undefined,
      });

      toast({
        title: "Project Inquiry Submitted!",
        description: user 
          ? "Your inquiry has been sent to our sales team and added to your Client Portal Dashboard." 
          : "Thank you! Our sales team will review your project and get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        services: {
          webDesign: false,
          digitalMarketing: false,
          branding: false,
          videoProduction: false,
          salesLeadGen: false,
          strategyConsulting: false,
        },
        webDesign: {
          websiteType: "",
          numberOfPages: "",
          cmsEcommerce: "",
          specialFeatures: "",
          paymentIntegration: "",
          inventory: "",
          productCatalog: "",
        },
        digitalMarketing: {
          package: "",
          channels: {
            socialMedia: false,
            ads: false,
            seo: false,
            email: false,
          },
          monthlyBudget: "",
          goal: "",
          adBudget: "",
          targetAudience: "",
          campaignDuration: "",
        },
        branding: {
          serviceType: "",
          printMaterials: "",
          brandGuidelines: "",
          additionalNotes: "",
          brochures: "",
          businessCards: "",
          packaging: "",
          socialMediaKit: "",
        },
        videoProduction: {
          type: "",
          length: "",
          socialMediaReady: "",
          scriptNeeded: "",
          storyboard: "",
          voiceTalent: "",
          music: "",
          subtitles: "",
        },
        salesLeadGen: {
          type: "",
          monthlyBudget: "",
          leadSourcePreferences: {
            online: false,
            offline: false,
            both: false,
          },
          targetMarket: "",
          adSpend: "",
          funnelStages: "",
          kpis: "",
          reportingFrequency: "",
        },
        strategyConsulting: {
          type: "",
          duration: "",
          focusAreas: "",
          teamSize: "",
          department: "",
          learningGoals: "",
        },
        desiredStartDate: "",
        estimatedBudget: "",
        urgency: "",
        additionalNotes: "",
        uploadedFiles: [],
      });

    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Failed to submit your project. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Form */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info Section */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your Company Ltd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0971 234 567"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Select Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'webDesign', label: 'Web Design & Development' },
                    { key: 'digitalMarketing', label: 'Digital Marketing' },
                    { key: 'branding', label: 'Branding & Design' },
                    { key: 'videoProduction', label: 'Video Production' },
                    { key: 'salesLeadGen', label: 'Sales & Lead Generation' },
                    { key: 'strategyConsulting', label: 'Strategy & Consulting' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={key}
                        checked={formData.services[key as keyof typeof formData.services]}
                        onCheckedChange={(checked) => handleServiceChange(key as keyof typeof formData.services, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="font-medium cursor-pointer">{label}</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service-Specific Fields */}
              {formData.services.webDesign && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Web Design & Development Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Website Type *</Label>
                        <Select value={formData.webDesign.websiteType} onValueChange={(value) => handleNestedChange('webDesign', 'websiteType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select website type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Website - K5,000</SelectItem>
                            <SelectItem value="standard">Standard Website - K7,500</SelectItem>
                            <SelectItem value="premium">Premium Website - K15,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Number of Pages</Label>
                        <Input
                          value={formData.webDesign.numberOfPages}
                          onChange={(e) => handleNestedChange('webDesign', 'numberOfPages', e.target.value)}
                          placeholder="e.g., 5-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>CMS/E-commerce Needed?</Label>
                      <Select value={formData.webDesign.cmsEcommerce} onValueChange={(value) => handleNestedChange('webDesign', 'cmsEcommerce', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Special Features</Label>
                      <Textarea
                        value={formData.webDesign.specialFeatures}
                        onChange={(e) => handleNestedChange('webDesign', 'specialFeatures', e.target.value)}
                        placeholder="Describe any special features you need..."
                        rows={3}
                      />
                    </div>
                    {formData.webDesign.cmsEcommerce === 'yes' && (
                      <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium">E-commerce Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Payment Integration</Label>
                            <Input
                              value={formData.webDesign.paymentIntegration}
                              onChange={(e) => handleNestedChange('webDesign', 'paymentIntegration', e.target.value)}
                              placeholder="e.g., PayPal, Stripe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Inventory Management</Label>
                            <Input
                              value={formData.webDesign.inventory}
                              onChange={(e) => handleNestedChange('webDesign', 'inventory', e.target.value)}
                              placeholder="e.g., Yes/No"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Product Catalog</Label>
                            <Input
                              value={formData.webDesign.productCatalog}
                              onChange={(e) => handleNestedChange('webDesign', 'productCatalog', e.target.value)}
                              placeholder="e.g., 100+ products"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.services.digitalMarketing && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Digital Marketing Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Package *</Label>
                        <Select value={formData.digitalMarketing.package} onValueChange={(value) => handleNestedChange('digitalMarketing', 'package', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select package" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="starter">Starter Spark - K850/mo</SelectItem>
                            <SelectItem value="elevate">Elevate Edge - K1,500/mo</SelectItem>
                            <SelectItem value="prestige">Prestige Pulse - K2,500+/mo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Budget</Label>
                        <Input
                          value={formData.digitalMarketing.monthlyBudget}
                          onChange={(e) => handleNestedChange('digitalMarketing', 'monthlyBudget', e.target.value)}
                          placeholder="e.g., K2,000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Marketing Channels</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { key: 'socialMedia', label: 'Social Media' },
                          { key: 'ads', label: 'Ads' },
                          { key: 'seo', label: 'SEO' },
                          { key: 'email', label: 'Email' },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dm-${key}`}
                              checked={formData.digitalMarketing.channels[key as keyof typeof formData.digitalMarketing.channels]}
                              onCheckedChange={(checked) => handleNestedChange('digitalMarketing', `channels.${key}`, checked as boolean)}
                            />
                            <Label htmlFor={`dm-${key}`} className="text-sm">{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Goal of Campaign</Label>
                      <Textarea
                        value={formData.digitalMarketing.goal}
                        onChange={(e) => handleNestedChange('digitalMarketing', 'goal', e.target.value)}
                        placeholder="What do you want to achieve with this campaign?"
                        rows={3}
                      />
                    </div>
                    {formData.digitalMarketing.channels.ads && (
                      <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium">Advertising Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Ad Budget</Label>
                            <Input
                              value={formData.digitalMarketing.adBudget}
                              onChange={(e) => handleNestedChange('digitalMarketing', 'adBudget', e.target.value)}
                              placeholder="e.g., K1,000/month"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Input
                              value={formData.digitalMarketing.targetAudience}
                              onChange={(e) => handleNestedChange('digitalMarketing', 'targetAudience', e.target.value)}
                              placeholder="e.g., 25-45, professionals"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Campaign Duration</Label>
                            <Input
                              value={formData.digitalMarketing.campaignDuration}
                              onChange={(e) => handleNestedChange('digitalMarketing', 'campaignDuration', e.target.value)}
                              placeholder="e.g., 3 months"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.services.branding && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Branding & Design Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Service Type *</Label>
                        <Select value={formData.branding.serviceType} onValueChange={(value) => handleNestedChange('branding', 'serviceType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="logo">Logo & Identity - K1,500</SelectItem>
                            <SelectItem value="profile">Company Profile - K1,500</SelectItem>
                            <SelectItem value="full">Full Branding - K3,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Print Materials Needed?</Label>
                        <Select value={formData.branding.printMaterials} onValueChange={(value) => handleNestedChange('branding', 'printMaterials', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Brand Guidelines Required?</Label>
                      <Select value={formData.branding.brandGuidelines} onValueChange={(value) => handleNestedChange('branding', 'brandGuidelines', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        value={formData.branding.additionalNotes}
                        onChange={(e) => handleNestedChange('branding', 'additionalNotes', e.target.value)}
                        placeholder="Describe your branding needs..."
                        rows={3}
                      />
                    </div>
                    {formData.branding.serviceType === 'full' && (
                      <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium">Full Branding Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Brochures</Label>
                            <Input
                              value={formData.branding.brochures}
                              onChange={(e) => handleNestedChange('branding', 'brochures', e.target.value)}
                              placeholder="e.g., Tri-fold, bi-fold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Business Cards</Label>
                            <Input
                              value={formData.branding.businessCards}
                              onChange={(e) => handleNestedChange('branding', 'businessCards', e.target.value)}
                              placeholder="e.g., Standard, premium"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Packaging</Label>
                            <Input
                              value={formData.branding.packaging}
                              onChange={(e) => handleNestedChange('branding', 'packaging', e.target.value)}
                              placeholder="e.g., Product boxes, labels"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Social Media Kit</Label>
                            <Input
                              value={formData.branding.socialMediaKit}
                              onChange={(e) => handleNestedChange('branding', 'socialMediaKit', e.target.value)}
                              placeholder="e.g., Profile pics, templates"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.services.videoProduction && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Video Production Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Video Type *</Label>
                        <Select value={formData.videoProduction.type} onValueChange={(value) => handleNestedChange('videoProduction', 'type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select video type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="voiceover">Voice-over - From K500</SelectItem>
                            <SelectItem value="skit">Short-form Skit - K2,500-5,000</SelectItem>
                            <SelectItem value="promo">Promo Video - K4,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Length (minutes)</Label>
                        <Input
                          value={formData.videoProduction.length}
                          onChange={(e) => handleNestedChange('videoProduction', 'length', e.target.value)}
                          placeholder="e.g., 1-3 minutes"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Social Media Ready?</Label>
                        <Select value={formData.videoProduction.socialMediaReady} onValueChange={(value) => handleNestedChange('videoProduction', 'socialMediaReady', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Script Needed?</Label>
                        <Select value={formData.videoProduction.scriptNeeded} onValueChange={(value) => handleNestedChange('videoProduction', 'scriptNeeded', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {(formData.videoProduction.type === 'skit' || formData.videoProduction.type === 'promo') && (
                      <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium">Production Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Storyboard</Label>
                            <Input
                              value={formData.videoProduction.storyboard}
                              onChange={(e) => handleNestedChange('videoProduction', 'storyboard', e.target.value)}
                              placeholder="e.g., Detailed, basic"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Voice Talent</Label>
                            <Input
                              value={formData.videoProduction.voiceTalent}
                              onChange={(e) => handleNestedChange('videoProduction', 'voiceTalent', e.target.value)}
                              placeholder="e.g., Male, female, multiple"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Music</Label>
                            <Input
                              value={formData.videoProduction.music}
                              onChange={(e) => handleNestedChange('videoProduction', 'music', e.target.value)}
                              placeholder="e.g., Background, custom"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Subtitles</Label>
                            <Input
                              value={formData.videoProduction.subtitles}
                              onChange={(e) => handleNestedChange('videoProduction', 'subtitles', e.target.value)}
                              placeholder="e.g., English, multiple languages"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.services.salesLeadGen && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Sales & Lead Generation Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Service Type *</Label>
                        <Select value={formData.salesLeadGen.type} onValueChange={(value) => handleNestedChange('salesLeadGen', 'type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inbound">Inbound Leads - K5,000/mo</SelectItem>
                            <SelectItem value="team">Sales Team - K10,000+/mo</SelectItem>
                            <SelectItem value="campaign">Full Campaign - K15,000-50,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Budget</Label>
                        <Input
                          value={formData.salesLeadGen.monthlyBudget}
                          onChange={(e) => handleNestedChange('salesLeadGen', 'monthlyBudget', e.target.value)}
                          placeholder="e.g., K10,000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Lead Source Preferences</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { key: 'online', label: 'Online' },
                          { key: 'offline', label: 'Offline' },
                          { key: 'both', label: 'Both' },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`lg-${key}`}
                              checked={formData.salesLeadGen.leadSourcePreferences[key as keyof typeof formData.salesLeadGen.leadSourcePreferences]}
                              onCheckedChange={(checked) => handleNestedChange('salesLeadGen', `leadSourcePreferences.${key}`, checked as boolean)}
                            />
                            <Label htmlFor={`lg-${key}`} className="text-sm">{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Market / Industry</Label>
                      <Textarea
                        value={formData.salesLeadGen.targetMarket}
                        onChange={(e) => handleNestedChange('salesLeadGen', 'targetMarket', e.target.value)}
                        placeholder="Describe your target market and industry..."
                        rows={3}
                      />
                    </div>
                    {formData.salesLeadGen.type === 'campaign' && (
                      <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium">Full Campaign Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Ad Spend</Label>
                            <Input
                              value={formData.salesLeadGen.adSpend}
                              onChange={(e) => handleNestedChange('salesLeadGen', 'adSpend', e.target.value)}
                              placeholder="e.g., K5,000/month"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Funnel Stages</Label>
                            <Input
                              value={formData.salesLeadGen.funnelStages}
                              onChange={(e) => handleNestedChange('salesLeadGen', 'funnelStages', e.target.value)}
                              placeholder="e.g., Awareness, consideration, conversion"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>KPIs</Label>
                            <Input
                              value={formData.salesLeadGen.kpis}
                              onChange={(e) => handleNestedChange('salesLeadGen', 'kpis', e.target.value)}
                              placeholder="e.g., Lead volume, conversion rate"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Reporting Frequency</Label>
                            <Input
                              value={formData.salesLeadGen.reportingFrequency}
                              onChange={(e) => handleNestedChange('salesLeadGen', 'reportingFrequency', e.target.value)}
                              placeholder="e.g., Weekly, monthly"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.services.strategyConsulting && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Strategy & Consulting Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Service Type *</Label>
                        <Select value={formData.strategyConsulting.type} onValueChange={(value) => handleNestedChange('strategyConsulting', 'type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="session">Strategy Session - K1,000</SelectItem>
                            <SelectItem value="audit">Marketing Audit - K5,000</SelectItem>
                            <SelectItem value="training">Training - K6,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={formData.strategyConsulting.duration}
                          onChange={(e) => handleNestedChange('strategyConsulting', 'duration', e.target.value)}
                          placeholder="e.g., 1 hour, 2 days"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Focus Areas</Label>
                      <Textarea
                        value={formData.strategyConsulting.focusAreas}
                        onChange={(e) => handleNestedChange('strategyConsulting', 'focusAreas', e.target.value)}
                        placeholder="What areas do you want to focus on?"
                        rows={3}
                      />
                    </div>
                    {formData.strategyConsulting.type === 'training' && (
                      <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium">Training Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Team Size</Label>
                            <Input
                              value={formData.strategyConsulting.teamSize}
                              onChange={(e) => handleNestedChange('strategyConsulting', 'teamSize', e.target.value)}
                              placeholder="e.g., 10 people"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Department</Label>
                            <Input
                              value={formData.strategyConsulting.department}
                              onChange={(e) => handleNestedChange('strategyConsulting', 'department', e.target.value)}
                              placeholder="e.g., Sales, Marketing"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Learning Goals</Label>
                            <Input
                              value={formData.strategyConsulting.learningGoals}
                              onChange={(e) => handleNestedChange('strategyConsulting', 'learningGoals', e.target.value)}
                              placeholder="e.g., Improve closing skills"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline & Budget */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Timeline & Budget</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="desiredStartDate">Desired Start Date</Label>
                    <Input
                      id="desiredStartDate"
                      type="date"
                      value={formData.desiredStartDate}
                      onChange={(e) => handleInputChange('desiredStartDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                    <Input
                      id="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                      placeholder="e.g., K10,000 - K20,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Upload Files (Optional)</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Upload references, mockups, scripts, images, or videos
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Maximum file size: 10MB
                    </p>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  {formData.uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Uploaded Files:</h4>
                      {formData.uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Additional Notes</h2>
                <Textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information or requirements..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button type="submit" size="lg" disabled={isSubmitting} className="px-8">
                  {isSubmitting ? "Submitting..." : "Submit Project Consultation"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectConsultation;
