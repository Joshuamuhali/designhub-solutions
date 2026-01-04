import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  MessageSquare, 
  Search, 
  Filter, 
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  User,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
}

interface Conversation {
  id: string;
  project_id?: string;
  project_name?: string;
  participant_id: string;
  participant_name: string;
  participant_avatar?: string;
  participant_role: 'client' | 'project_manager' | 'admin';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: 'active' | 'archived';
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 24 * 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // Mark messages as read
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Mock data for demonstration
      const mockConversations: Conversation[] = [
        {
          id: '1',
          project_id: '1',
          project_name: 'Web Design Project',
          participant_id: 'pm-1',
          participant_name: 'John Smith',
          participant_role: 'project_manager',
          last_message: 'The homepage mockups are ready for review',
          last_message_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          unread_count: 2,
          status: 'active'
        },
        {
          id: '2',
          project_id: '2',
          project_name: 'Branding Package',
          participant_id: 'pm-2',
          participant_name: 'Sarah Johnson',
          participant_role: 'project_manager',
          last_message: 'Logo concepts have been uploaded to the files section',
          last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread_count: 0,
          status: 'active'
        },
        {
          id: '3',
          project_id: '3',
          project_name: 'Digital Marketing',
          participant_id: 'admin-1',
          participant_name: 'Mike Wilson',
          participant_role: 'admin',
          last_message: 'Can we schedule a call to discuss the campaign strategy?',
          last_message_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          unread_count: 1,
          status: 'active'
        }
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      // Mock messages for demonstration
      const mockMessages: Message[] = [
        {
          id: '1',
          conversation_id: conversationId,
          sender_id: 'pm-1',
          sender_name: 'John Smith',
          content: 'Hi! I wanted to update you on the progress of your web design project.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          conversation_id: conversationId,
          sender_id: user?.id || 'user-1',
          sender_name: user?.email?.split('@')[0] || 'You',
          content: 'That\'s great to hear! How are things coming along?',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          conversation_id: conversationId,
          sender_id: 'pm-1',
          sender_name: 'John Smith',
          content: 'The homepage mockups are ready for review. I\'ve uploaded them to the files section.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'delivered',
          type: 'text'
        },
        {
          id: '4',
          conversation_id: conversationId,
          sender_id: 'pm-1',
          sender_name: 'John Smith',
          content: 'Let me know what you think and we can make any needed adjustments.',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          status: 'delivered',
          type: 'text'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      // Update conversation unread count
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      ));

      // Update message statuses
      setMessages(prev => prev.map(msg => 
        msg.conversation_id === conversationId && msg.sender_id !== user?.id
          ? { ...msg, status: 'read' as const }
          : msg
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: selectedConversation.id,
        sender_id: user?.id || 'user-1',
        sender_name: user?.email?.split('@')[0] || 'You',
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'text'
      };

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, message]);

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              last_message: newMessage.trim(),
              last_message_time: new Date().toISOString()
            }
          : conv
      ));

      // Clear input
      setNewMessage('');

      // In a real app, you would send this to your backend/Supabase
      // const { error } = await supabase
      //   .from('messages')
      //   .insert([message]);

      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        ));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'read' as const }
            : msg
        ));
      }, 2000);

      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Conversations List */}
        <div className="lg:col-span-1 border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-8rem)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {getInitials(conversation.participant_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participant_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.last_message_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {conversation.participant_role.replace('_', ' ')}
                      </Badge>
                      {conversation.project_name && (
                        <Badge variant="outline" className="text-xs">
                          <FolderOpen className="w-3 h-3 mr-1" />
                          {conversation.project_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-2">
                      {conversation.last_message}
                    </p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 border rounded-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {getInitials(selectedConversation.participant_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedConversation.participant_name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedConversation.participant_role.replace('_', ' ')}
                        </Badge>
                        {selectedConversation.project_name && (
                          <span className="text-sm text-gray-500">
                            {selectedConversation.project_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.sender_id === user?.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg p-3`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.sender_name}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender_id === user?.id && (
                          <span className="text-xs">
                            {message.status === 'sent' && <Clock className="w-3 h-3" />}
                            {message.status === 'delivered' && <Check className="w-3 h-3" />}
                            {message.status === 'read' && <CheckCheck className="w-3 h-3" />}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="resize-none"
                      rows={1}
                    />
                  </div>
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || sendingMessage}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
