import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type ServiceRequest = {
  id: string;
  service_type: string;
  description: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    service_type: '',
    description: '',
    files: [] as File[],
  });

  const serviceTypes = [
    'Web design',
    'Branding',
    'Digital marketing',
    'Video production',
    'Sales & lead generation',
  ];

  useEffect(() => {
    if (user) {
      fetchServiceRequests();
    }
  }, [user]);

  const fetchServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // First create the service request
      const { data: requestData, error: requestError } = await supabase
        .from('service_requests')
        .insert([{
          service_type: newRequest.service_type,
          description: newRequest.description,
          client_id: user.id,
          status: 'pending',
        }] as any)
        .select()
        .single();

      if (requestError) throw requestError;

      // Upload files if any
      if (newRequest.files.length > 0 && requestData) {
        for (const file of newRequest.files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${(requestData as any).id}_${Date.now()}.${fileExt}`;
          const filePath = `service-requests/${(requestData as any).id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('service-files')
            .upload(filePath, file);

          if (uploadError) throw uploadError;
        }
      }

      toast.success('Service request created successfully!');
      setNewRequest({ service_type: '', description: '', files: [] });
      setShowNewRequestForm(false);
      fetchServiceRequests();
    } catch (error) {
      console.error('Error creating service request:', error);
      toast.error('Failed to create service request');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Service Requests</h2>
          <Button onClick={() => setShowNewRequestForm(!showNewRequestForm)}>
            {showNewRequestForm ? 'Cancel' : 'New Request'}
          </Button>
        </div>

        {showNewRequestForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New Service Request</CardTitle>
              <CardDescription>Fill out the form to submit a new service request.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateRequest}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select
                    value={newRequest.service_type}
                    onValueChange={(value) => setNewRequest({ ...newRequest, service_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Requirements</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project requirements in detail..."
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="files">Optional Files (Images, Documents)</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => setNewRequest({ ...newRequest, files: Array.from(e.target.files || []) })}
                  />
                  <p className="text-sm text-gray-500">
                    Upload images, logos, documents, or other relevant files
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No service requests yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new service request.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.service_type}</CardTitle>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {request.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
