import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Calendar, 
  User, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle,
  PauseCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  service_type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  created_at: string;
  updated_at: string;
  project_manager?: string;
  start_date?: string;
  end_date?: string;
  progress: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'in_progress';
  due_date: string;
  completed_date?: string;
}

const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: <Clock className="w-4 h-4" /> 
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800', 
    icon: <PlayCircle className="w-4 h-4" /> 
  },
  review: { 
    label: 'Review', 
    color: 'bg-purple-100 text-purple-800', 
    icon: <AlertCircle className="w-4 h-4" /> 
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800', 
    icon: <CheckCircle className="w-4 h-4" /> 
  }
};

export default function Timeline() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data: requests, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform requests into project format with mock data
      const transformedProjects: Project[] = (requests || []).map((request, index) => ({
        id: request.id,
        service_type: request.service_type,
        description: request.description,
        status: request.status as any,
        created_at: request.created_at,
        updated_at: request.updated_at,
        project_manager: ['John Smith', 'Sarah Johnson', 'Mike Wilson'][index % 3],
        start_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: request.status === 'completed' ? 100 : 
                 request.status === 'review' ? 75 : 
                 request.status === 'in_progress' ? 40 : 0,
        milestones: generateMockMilestones(request.service_type)
      }));

      setProjects(transformedProjects);
      if (transformedProjects.length > 0) {
        setSelectedProject(transformedProjects[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockMilestones = (serviceType: string): Milestone[] => {
    const baseMilestones = [
      { title: 'Requirements Gathering', description: 'Collect and document project requirements' },
      { title: 'Initial Design', description: 'Create initial design concepts' },
      { title: 'Development Phase', description: 'Build the core functionality' },
      { title: 'Testing & QA', description: 'Quality assurance and testing' },
      { title: 'Final Delivery', description: 'Project completion and handover' }
    ];

    return baseMilestones.map((milestone, index) => ({
      id: `${serviceType}-${index}`,
      ...milestone,
      status: index < 2 ? 'completed' : index === 2 ? 'in_progress' : 'pending',
      due_date: new Date(Date.now() + (index - 2) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed_date: index < 2 ? new Date(Date.now() - (2 - index) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
    }));
  };

  const getStatusColor = (status: Project['status']) => statusConfig[status].color;
  const getStatusIcon = (status: Project['status']) => statusConfig[status].icon;

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
        <h1 className="text-3xl font-bold text-gray-900">Project Timeline</h1>
        <p className="text-gray-600 mt-2">Track the progress and milestones of your projects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>Select a project to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProject?.id === project.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {project.service_type}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{statusConfig[project.status].label}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="space-y-6">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(selectedProject.status)}
                        <span>{selectedProject.service_type}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {selectedProject.description}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {statusConfig[selectedProject.status].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Project Manager</p>
                        <p className="text-sm text-gray-500">{selectedProject.project_manager}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-sm text-gray-500">
                          {selectedProject.start_date} - {selectedProject.end_date}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Overall Progress</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <Progress value={selectedProject.progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Milestones Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>Key deliverables and timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedProject.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                            milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {milestone.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                             milestone.status === 'in_progress' ? <PlayCircle className="w-4 h-4" /> :
                             <Clock className="w-4 h-4" />}
                          </div>
                          {index < selectedProject.milestones.length - 1 && (
                            <div className={`w-0.5 h-16 mt-2 ${
                              milestone.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {milestone.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {milestone.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Due: {milestone.due_date}
                              </p>
                              {milestone.completed_date && (
                                <p className="text-xs text-green-600">
                                  Completed: {milestone.completed_date}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-12">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" className="h-12">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="h-12">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a project to view timeline details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
