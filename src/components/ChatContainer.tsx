import React from 'react';
import type { Message } from '../types';

interface ChatContainerProps {
    messages: Message[];
    isLoading: boolean;
    onShare: (message: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
    messages,
    isLoading,
    onShare
}) => {
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="chat-container">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    データを読み込んでいます...
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {messages.map(message => (
                <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-avatar">
                        {message.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="message-content">
                        <div className="message-text">{message.content}</div>
                        <div className="message-timestamp">
                            {formatTimestamp(message.timestamp)}
                        </div>
                        <div className="message-actions">
                            <button
                                className="message-action-btn"
                                onClick={() => navigator.clipboard.writeText(message.content)}
                            >
                                <i className="fas fa-copy"></i>
                            </button>
                            <button
                                className="message-action-btn"
                                onClick={() => onShare(message.content)}
                            >
                                <i className="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatContainer;
