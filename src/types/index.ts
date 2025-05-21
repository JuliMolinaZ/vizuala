export type MessageRole = 'user' | 'system' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'file' | 'image' | 'audio';
    name: string;
    url: string;
    duration?: number; // Duración del audio en segundos
  }>;
}

export interface Report {
  id: string;
  name: string;
  icon: React.ReactNode;
  date: string;
  chat: Message[];
  previewItems?: Array<{
    name: string;
    html: string;
  }>;
  previewHtml?: string;
  metadata?: {
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
    lastModified?: Date;
    createdBy?: string;
  };
}

export interface SidebarProps {
  reports: Report[];
  selected: string;
  onSelect: (id: string) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
}

export interface ChatWindowProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export interface ReportPreviewItem {
  id: string;
  name: string;
  previewHtml: string;
}

export interface PreviewPaneProps {
  reports: ReportPreviewItem[];
}
