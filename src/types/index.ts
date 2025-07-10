export interface Message {
    id: number;
    session_id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface Session {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface ChatData {
    sessions: Session[];
    messages: Message[];
}

export interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}
