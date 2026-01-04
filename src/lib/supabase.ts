import { createClient } from '@supabase/supabase-js';

// @ts-nocheck
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a singleton instance to prevent multiple clients
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
})();

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    console.log('Attempting sign up with email:', email);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log('Sign up result:', result);

    if (result.error) {
      console.error('Sign up error details:', result.error);
      throw result.error;
    }

    return result;
  } catch (error) {
    console.error('Sign up exception:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting sign in with email:', email);
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in result:', result);
    
    if (result.error) {
      console.error('Sign in error details:', result.error);
      throw result.error;
    }
    
    return result;
  } catch (error) {
    console.error('Sign in exception:', error);
    throw error;
  }
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Dashboard data fetching functions
export async function getServiceRequests(userId: string) {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
}

export async function getDashboardData(userId: string) {
  try {
    const [serviceRequests, projects, quotes, invoices, messages] = await Promise.all([
      getServiceRequests(userId),
      getProjects(userId),
      getQuotes(userId),
      getInvoices(userId),
      getConversations(userId)
    ]);

    return {
      serviceRequests,
      projects,
      quotes,
      invoices,
      messages,
      stats: {
        totalProjects: projects?.length || 0,
        activeProjects: projects?.filter((p: any) => p.status === 'in_progress').length || 0,
        completedProjects: projects?.filter((p: any) => p.status === 'completed').length || 0,
        pendingRequests: serviceRequests?.filter((r: any) => r.status === 'pending').length || 0,
        totalRevenue: invoices?.filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + (i.amount || 0), 0) || 0,
        unreadMessages: messages?.filter((m: any) => m.unread_count > 0).length || 0
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export async function getProjects(userId: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        service_requests!inner(
          user_id,
          service_type,
          description
        ),
        project_milestones(*)
      `)
      .eq('service_requests.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getQuotes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        quote_items(*),
        projects!inner(
          name,
          service_requests!inner(
            user_id
          )
        )
      `)
      .eq('projects.service_requests.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
}

export async function getInvoices(userId: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        quotes!inner(
          projects!inner(
            service_requests!inner(
              user_id
            )
          )
        )
      `)
      .eq('quotes.projects.service_requests.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

export async function getConversations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_1:profiles!conversations_participant_1_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        participant_2:profiles!conversations_participant_2_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        messages(count)
      `)
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
      .order('last_message_time', { ascending: false });

    if (error) throw error;
    
    // Transform data to include unread count
    return data?.map((conv: any) => ({
      ...conv,
      participant_name: conv.participant_1_id === userId ? 
        conv.participant_2?.full_name : 
        conv.participant_1?.full_name,
      participant_avatar: conv.participant_1_id === userId ? 
        conv.participant_2?.avatar_url : 
        conv.participant_1?.avatar_url,
      unread_count: 0 // TODO: Calculate actual unread count
    })) || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

export async function getMessages(conversationId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function sendMessage(messageData: {
  conversationId: string;
  senderId: string;
  content: string;
  type?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: messageData.conversationId,
        sender_id: messageData.senderId,
        content: messageData.content,
        type: messageData.type || 'text'
      } as any)
      .select()
      .single();

    if (error) throw error;
    
    // Update conversation last message
    await supabase
      .from('conversations')
      .update({
        last_message: messageData.content,
        last_message_time: new Date().toISOString()
      } as never)
      .eq('id', messageData.conversationId);
    
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        sender:profiles(
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true } as never)
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true } as never)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

export async function createProject(projectData: {
  serviceRequestId: string;
  name: string;
  description?: string;
  budget?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        service_request_id: projectData.serviceRequestId,
        name: projectData.name,
        description: projectData.description,
        budget: projectData.budget,
        status: 'pending',
        start_date: new Date().toISOString()
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProjectStatus(projectId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        end_date: status === 'completed' ? new Date().toISOString() : null
      } as never)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

export async function createQuote(quoteData: {
  projectId: string;
  title: string;
  description: string;
  amount: number;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unit_price: number;
  }>;
}) {
  try {
    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        project_id: quoteData.projectId,
        title: quoteData.title,
        description: quoteData.description,
        amount: quoteData.amount,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      } as any)
      .select()
      .single();

    if (quoteError) throw quoteError;

    // Create quote items
    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(
        quoteData.items.map(item => ({
          quote_id: (quote as any)?.id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.quantity * item.unit_price
        })) as any
      );

    if (itemsError) throw itemsError;

    return quote;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
}

export async function updateQuoteStatus(quoteId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      } as never)
      .eq('id', quoteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
}

export async function createInvoice(invoiceData: {
  quoteId: string;
  amount: number;
  dueDate: string;
}) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        quote_id: invoiceData.quoteId,
        amount: invoiceData.amount,
        status: 'draft',
        due_date: invoiceData.dueDate
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: string, paymentMethod?: string) {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'paid') {
      updateData.paid_date = new Date().toISOString();
      updateData.payment_method = paymentMethod;
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData as never)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
}

export async function uploadFileRecord(fileData: {
  userId: string;
  projectId?: string;
  conversationId?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}) {
  try {
    const { data, error } = await supabase
      .from('file_attachments')
      .insert({
        user_id: fileData.userId,
        project_id: fileData.projectId,
        conversation_id: fileData.conversationId,
        file_name: fileData.fileName,
        file_path: fileData.filePath,
        file_size: fileData.fileSize,
        mime_type: fileData.mimeType
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading file record:', error);
    throw error;
  }
}

export async function getFiles(userId: string, projectId?: string) {
  try {
    let query = supabase
      .from('file_attachments')
      .select('*')
      .eq('user_id', userId);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

// File Uploads
export const uploadFile = async (file: File, path: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('files')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('files')
    .getPublicUrl(data.path);

  return { path: data.path, url: publicUrl };
};

// Messages
export const sendRequestMessage = async (message: {
  request_id: string;
  sender_id: string;
  message_text: string;
}) => {
  return await supabase
    .from('messages')
    .insert(message as any)
    .select();
};

export const subscribeToMessages = (requestId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `request_id=eq.${requestId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
