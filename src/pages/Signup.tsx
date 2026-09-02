import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PRODUCTS } from '@/data/products';
import { createProductInquiryLead } from '@/services/dashboardService';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    interests: [] as string[],
    acceptTerms: false,
    acceptPrivacy: false,
    marketingConsent: false
  });
  const [loading, setLoading] = useState(false);
  const [showAdminFields, setShowAdminFields] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validations
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      toast.error("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      
      const searchParams = new URLSearchParams(window.location.search);
      const productId = searchParams.get('product') || '';
      const categoryId = searchParams.get('category') || '';
      const selectedProdObj = productId ? PRODUCTS.find(p => p.id === productId) : null;

      // Prepare user metadata with client role (default)
      const userMetadata: any = {
        full_name: formData.fullName,
        role: 'client', // Always default to client for public signup
        intended_product: selectedProdObj?.name || productId || '',
        intended_category: categoryId || selectedProdObj?.categoryId || ''
      };

      const authData = await signUp(formData.email, formData.password, userMetadata);
      
      if (selectedProdObj || productId || categoryId) {
        try {
          await createProductInquiryLead({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phoneNumber || '',
            productId: selectedProdObj?.id || productId,
            productName: selectedProdObj?.name || 'Selected Solution',
            categoryId: selectedProdObj?.categoryId || categoryId,
            categoryTitle: selectedProdObj?.categoryName || 'General Category',
            priceAnchor: selectedProdObj?.price || 'N/A',
            additionalNotes: `Auto-generated inquiry during client signup.`,
            user_id: authData?.user?.id
          });
        } catch (inqErr) {
          console.warn("Inquiry creation deferred during signup:", inqErr);
        }
      }

      toast.success("Client account created successfully! Please check your email to verify your account.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to create an account");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create a new account</CardTitle>
            <CardDescription>
              Join Designhub to access our services and grow your business online.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Client Account Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-4 bg-primary/5 border border-primary rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Client Account</div>
                    <div className="text-sm text-gray-600">Standard user access to your projects and services</div>
                  </div>
                </div>
              </div>

              {/* Basic Required Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="username">Username (Optional)</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              {/* Optional Extended Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+260 974 399 695"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Kamwala South, Lusaka, Zambia"
                  />
                </div>
              </div>

              {/* Consent & Compliance */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Terms & Privacy</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      I accept the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                      required
                    />
                    <Label htmlFor="acceptPrivacy" className="text-sm">
                      I accept the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketingConsent"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => handleInputChange('marketingConsent', checked)}
                    />
                    <Label htmlFor="marketingConsent" className="text-sm">
                      I would like to receive marketing emails and newsletters (optional)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
