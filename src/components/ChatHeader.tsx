import React from 'react';

interface ChatHeaderProps {
    onClearChat: () => void;
    onExportChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClearChat, onExportChat }) => {
    return (
        <div className="chat-header">
            <div className="model-selector">
                <select id="modelSelect">
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                </select>
            </div>
            <div className="chat-actions">
                <button className="action-btn" onClick={onClearChat}>
                    <i className="fas fa-broom"></i>
                </button>
                <button className="action-btn" onClick={onExportChat}>
                    <i className="fas fa-download"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
