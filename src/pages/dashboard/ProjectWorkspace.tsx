import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useERPProjectDetails, useUpdateTaskStatus, useCreateTask, useUploadProjectFile, useConfirmProjectCompletion, useRecordPayment } from '@/hooks/useERP';
import type { ERPProject, ERPTask, ERPFile, ERPRevision, ERPInvoice } from '@/services/erpService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientApprovalModal } from '@/components/ClientApprovalModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  UserCheck,
  Upload,
  Plus,
  ArrowLeft,
  Eye,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Loader2,
  Lock,
  Download,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: projectData, isLoading, error } = useERPProjectDetails(projectId || '');
  const updateTaskStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const uploadProjectFile = useUploadProjectFile();
  const confirmProjectCompletion = useConfirmProjectCompletion();
  const recordPayment = useRecordPayment();

  const project = projectData?.project || null;
  const tasks = projectData?.tasks || [];
  const files = projectData?.files || [];
  const revisions = projectData?.revisions || [];
  const invoice = projectData?.invoice || null;

  // Role Perspective Simulator for Demonstration
  const [activeRoleView, setActiveRoleView] = useState<'pm' | 'designer' | 'sales' | 'client'>('pm');

  // Modals State
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // File Upload State
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploadVisibility, setUploadVisibility] = useState<ERPFile['visibility']>('client_review');


  const handleTaskStatusToggle = async (taskId: string, currentStatus: ERPTask['status']) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    updateTaskStatus.mutate({ taskId, status: nextStatus }, {
      onSuccess: () => toast.success('Task status updated')
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !project) return;
    setIsCreatingTask(true);
    createTask.mutate({ projectId: project.id, title: newTaskTitle }, {
      onSuccess: () => {
        setIsCreatingTask(false);
        setNewTaskTitle('');
        toast.success('New task added');
      }
    });
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName || !project) return;

    const url = uploadFileUrl || 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800';
    uploadProjectFile.mutate({ projectId: project.id, fileName: uploadFileName, fileUrl: url, visibility: uploadVisibility }, {
      onSuccess: () => {
        setUploadFileName('');
        setUploadFileUrl('');
        toast.success('File uploaded to project repository');
      }
    });
  };

  const handlePMConfirmCompletion = async () => {
    if (!project) return;
    confirmProjectCompletion.mutate({ projectId: project.id }, {
      onSuccess: (res) => {
        toast.success(`Project Completed! Invoice ${res.invoiceNumber} generated for Accounts.`);
      }
    });
  };

  const handleSimulatePayment = async () => {
    if (!invoice) return;
    recordPayment.mutate({ invoiceId: invoice.id, amount: invoice.total_amount, paymentMethod: 'mobile_money' }, {
      onSuccess: () => {
        toast.success('Payment of K5,000 received via Airtel / MTN MoMo!');
        setIsFeedbackModalOpen(true);
      }
    });
  };

  if (isLoading || !project) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
        <p className="text-xs text-muted-foreground mt-2">Loading ERP Project Workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <AlertCircle className="w-10 h-10 mx-auto text-destructive" />
        <p className="text-xs text-muted-foreground mt-2">Failed to load project: {error.message}</p>
      </div>
    );
  }

  // Filter Files based on Role View Scope
  const visibleFiles = files.filter(f => {
    if (activeRoleView === 'client') {
      return f.visibility === 'client_review' || f.visibility === 'final_deliverable';
    }
    if (activeRoleView === 'designer') {
      return f.visibility === 'working_file' || f.visibility === 'client_review';
    }
    return true; // PM and Sales see all
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Perspective Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-xs gap-1">
            <ArrowLeft className="w-4 h-4" /> Projects
          </Button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-xs text-primary font-bold">{project.project_number}</span>
        </div>

        {/* Role View Perspective Simulator */}
        <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border border-border">
          <span className="text-[11px] font-semibold text-muted-foreground px-2">Role Perspective:</span>
          <Select value={activeRoleView} onValueChange={(val: any) => setActiveRoleView(val)}>
            <SelectTrigger className="h-7 text-xs bg-background w-36 font-semibold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pm">PM / Admin View</SelectItem>
              <SelectItem value="designer">Designer Workspace</SelectItem>
              <SelectItem value="sales">Sales Overview</SelectItem>
              <SelectItem value="client">Client Portal View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Banner & Progress Bar */}
      <Card className="border-border bg-gradient-to-r from-card via-card to-primary/5">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  {project.project_number}
                </Badge>
                <Badge
                  variant={project.status === 'completed' ? 'default' : 'secondary'}
                  className="text-[10px] uppercase tracking-wider font-semibold"
                >
                  {project.status.replace('_', ' ')}
                </Badge>
                {project.due_date && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Due: {project.due_date}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <p className="text-xs text-muted-foreground">
                Client: <strong className="text-foreground">{project.company_name}</strong> ({project.contact_name})
              </p>
            </div>

            {/* Quick Actions per Role */}
            <div className="flex items-center gap-2">
              {activeRoleView === 'client' && (project.status === 'client_review' || project.status === 'in_progress') && (
                <Button
                  size="sm"
                  onClick={() => setIsApprovalModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5"
                >
                  <Eye className="w-4 h-4" /> Review Proof & Approve
                </Button>
              )}

              {activeRoleView === 'pm' && project.status === 'client_approved' && (
                <Button
                  size="sm"
                  onClick={handlePMConfirmCompletion}
                  className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> PM Confirm Completion & Trigger Accounts
                </Button>
              )}

              {invoice && invoice.status === 'unpaid' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSimulatePayment}
                  className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold gap-1.5"
                >
                  <CreditCard className="w-4 h-4" /> Pay Invoice (K{invoice.total_amount.toLocaleString()})
                </Button>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Project Completion Progress</span>
              <span className="font-mono font-bold text-primary">{project.progress_percentage}%</span>
            </div>
            <Progress value={project.progress_percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Workspace */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-card border border-border p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="text-xs">Overview & Brief</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="files" className="text-xs">Files Repository ({visibleFiles.length})</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs">Billing & Invoices</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & BRIEF */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-bold">Project Requirements & Brief</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="bg-muted/40 p-4 rounded-xl text-xs text-foreground leading-relaxed border border-border/60">
                  {project.brief || 'No formal brief supplied yet.'}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Service Type</span>
                    <p className="text-xs font-bold capitalize">{project.offering_slug || 'Custom Service'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Deal Value</span>
                    <p className="text-xs font-bold text-emerald-600">K{project.deal_value.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground uppercase font-semibold">Assigned PM</span>
                    <p className="text-xs font-bold">Joshua Muhali</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Info Card */}
            <Card className="border-border">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-bold">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Company:</span>
                  <p className="font-bold text-foreground">{project.company_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Primary Contact:</span>
                  <p className="font-semibold text-foreground">{project.contact_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-mono text-muted-foreground">{project.contact_email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-mono text-muted-foreground">{project.contact_phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: TASKS & MILESTONES */}
        <TabsContent value="tasks" className="space-y-4">
          {activeRoleView !== 'client' && (
            <Card className="border-border p-4 bg-card">
              <form onSubmit={handleCreateTask} className="flex gap-2">
                <Input
                  placeholder="Add a new production task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="h-9 text-xs"
                />
                <Button type="submit" size="sm" disabled={isCreatingTask} className="gap-1 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </Button>
              </form>
            </Card>
          )}

          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="border-border bg-card">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTaskStatusToggle(task.id, task.status)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <h4 className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h4>
                      {task.description && <p className="text-[11px] text-muted-foreground">{task.description}</p>}
                    </div>
                  </div>

                  <Badge variant="outline" className="text-[10px]">
                    {task.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: FILES REPOSITORY */}
        <TabsContent value="files" className="space-y-4">
          {activeRoleView !== 'client' && (
            <Card className="border-border p-4 bg-card">
              <form onSubmit={handleUploadFile} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  placeholder="File name (e.g. Proof-v2.pdf)"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="h-9 text-xs"
                />
                <Input
                  placeholder="URL link (optional)"
                  value={uploadFileUrl}
                  onChange={(e) => setUploadFileUrl(e.target.value)}
                  className="h-9 text-xs"
                />
                <Select value={uploadVisibility} onValueChange={(val: any) => setUploadVisibility(val)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working_file">Working File (Internal)</SelectItem>
                    <SelectItem value="client_review">Client Review Proof</SelectItem>
                    <SelectItem value="final_deliverable">Final Deliverable</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm" className="h-9 text-xs font-semibold gap-1">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </Button>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleFiles.map((file) => (
              <Card key={file.id} className="border-border bg-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{file.file_name}</h4>
                      <p className="text-[10px] text-muted-foreground">Size: {file.file_size} | v{file.version}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {file.visibility.replace('_', ' ')}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(file.file_url, '_blank')}
                      className="text-xs h-7 gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: BILLING & INVOICES */}
        <TabsContent value="billing" className="space-y-4">
          {invoice ? (
            <Card className="border-border bg-card">
              <CardHeader className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">{invoice.invoice_number}</CardTitle>
                    <CardDescription className="text-xs">Invoice generated automatically upon PM completion trigger.</CardDescription>
                  </div>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'} className="text-xs uppercase">
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="flex justify-between items-baseline border-t border-b border-border/60 py-3">
                  <span className="text-xs text-muted-foreground font-semibold">Total Agreed Amount:</span>
                  <span className="text-2xl font-bold text-foreground">K{invoice.total_amount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  {invoice.status === 'unpaid' ? (
                    <Button
                      onClick={handleSimulatePayment}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-2"
                    >
                      <CreditCard className="w-4 h-4" /> Simulate Mobile Money / Card Payment
                    </Button>
                  ) : (
                    <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Paid in full via Mobile Money on {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : 'Today'}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="text-xs gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Post-Project Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center border-dashed">
              <p className="text-xs text-muted-foreground">No invoice generated yet. Invoice will be generated automatically when PM completes the project.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Proof Review Modal */}
      <ClientApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        projectId={project.id}
        revision={revisions[0] || null}
        onSuccess={() => {}}
      />

      {/* Post-Project Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        projectId={project.id}
      />
    </div>
  );
}
