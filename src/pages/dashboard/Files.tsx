import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Download, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Eye,
  Trash2,
  Search,
  Filter,
  FolderOpen,
  Clock,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
  project_id?: string;
  project_name?: string;
  description?: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
  if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
  if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
  if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-4 h-4" />;
  if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Files() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
    try {
      // Fetch files from Supabase Storage
      const { data: fileList, error } = await supabase.storage
        .from('service-files')
        .list('', { limit: 100 });

      if (error) throw error;

      // Transform and filter files for this user
      const userFiles: FileItem[] = (fileList || [])
        .filter((file: any) => file.name.includes(user?.id || ''))
        .map((file: any, index) => ({
          id: file.id,
          name: file.name.split('/').pop() || file.name,
          type: file.metadata?.mimetype || 'unknown',
          size: (file as any).size || 0,
          url: '',
          uploaded_by: 'DesignHub Team',
          uploaded_at: file.created_at || new Date().toISOString(),
          project_id: `project-${index}`,
          project_name: ['Web Design', 'Branding', 'Digital Marketing'][index % 3],
          description: `Project file for ${['Web Design', 'Branding', 'Digital Marketing'][index % 3]}`
        }));

      setFiles(userFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      // Create mock data for demonstration
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'logo-design-final.png',
          type: 'image/png',
          size: 2048576,
          url: '/mock-files/logo-design-final.png',
          uploaded_by: 'DesignHub Team',
          uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          project_id: 'project-1',
          project_name: 'Branding Package',
          description: 'Final logo design with variations'
        },
        {
          id: '2',
          name: 'website-mockup.pdf',
          type: 'application/pdf',
          size: 5242880,
          url: '/mock-files/website-mockup.pdf',
          uploaded_by: 'DesignHub Team',
          uploaded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          project_id: 'project-2',
          project_name: 'Web Design',
          description: 'Website design mockups and wireframes'
        },
        {
          id: '3',
          name: 'social-media-strategy.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1048576,
          url: '/mock-files/social-media-strategy.docx',
          uploaded_by: 'DesignHub Team',
          uploaded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          project_id: 'project-3',
          project_name: 'Digital Marketing',
          description: 'Social media marketing strategy document'
        }
      ];
      setFiles(mockFiles);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const newUploadProgress: UploadProgress[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadProgress(prev => [...prev, ...newUploadProgress]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `user-files/${user?.id}/${fileName}`;

      try {
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('service-files')
          .upload(filePath, file);

        if (error) throw error;

        // Update progress
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === prev.length - files.length + i 
              ? { ...item, progress: 100, status: 'completed' as const }
              : item
          )
        );

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('service-files')
          .getPublicUrl(data.path);

        // Add to files list
        const newFile: FileItem = {
          id: data.id,
          name: file.name,
          type: file.type,
          size: file.size,
          url: publicUrl,
          uploaded_by: user?.email || 'You',
          uploaded_at: new Date().toISOString(),
          description: `Uploaded by ${user?.email}`
        };

        setFiles(prev => [newFile, ...prev]);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === prev.length - files.length + i 
              ? { ...item, status: 'error' as const }
              : item
          )
        );
      }
    }

    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploadProgress(prev => prev.filter(item => item.status !== 'completed'));
    }, 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      // For demo purposes, create a download link
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      // Delete from Supabase Storage
      // const { error } = await supabase.storage
      //   .from('service-files')
      //   .remove([fileId]);
      
      // For demo, just remove from state
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || file.project_id === selectedProject;
    return matchesSearch && matchesProject;
  });

  const projects = Array.from(new Set(files.map(f => f.project_name).filter(Boolean)));

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
        <h1 className="text-3xl font-bold text-gray-900">Files & Media</h1>
        <p className="text-gray-600 mt-2">Share and manage project files with your team.</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse. Supported formats: Images, PDFs, Documents, Videos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Maximum file size: 10MB. Supported formats: JPG, PNG, PDF, DOC, MP4
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.mp4,.mov"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadProgress.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.file.name}</span>
                      <span className="text-xs text-gray-500">
                        {item.status === 'uploading' ? `${item.progress}%` :
                         item.status === 'completed' ? 'Completed' : 'Error'}
                      </span>
                    </div>
                    {item.status === 'uploading' && (
                      <Progress value={item.progress} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {file.description && (
                <p className="text-sm text-gray-600 mb-3">{file.description}</p>
              )}
              {file.project_name && (
                <Badge variant="secondary" className="mb-3">
                  <FolderOpen className="w-3 h-3 mr-1" />
                  {file.project_name}
                </Badge>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{file.uploaded_by}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(file.uploaded_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedProject !== 'all' 
                  ? 'No files found matching your criteria' 
                  : 'No files uploaded yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
