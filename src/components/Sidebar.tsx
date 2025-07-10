import React from 'react';
import type { Session } from '../types';

interface SidebarProps {
    sessions: Session[];
    currentSessionId: number | null;
    onSessionSelect: (sessionId: number) => void;
    onNewChat: () => void;
    onSessionDelete: (sessionId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    sessions,
    currentSessionId,
    onSessionSelect,
    onNewChat,
    onSessionDelete
}) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    <i className="fas fa-plus"></i>
                    新しいチャット
                </button>
            </div>

            <div className="chat-history">
                {sessions.map(session => (
                    <div
                        key={session.id}
                        className={`chat-item ${currentSessionId === session.id ? 'active' : ''}`}
                        onClick={() => onSessionSelect(session.id)}
                    >
                        <i className="fas fa-comment"></i>
                        <span>{session.title}</span>
                        <button
                            className="delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSessionDelete(session.id);
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">U</div>
                    <div className="user-details">
                        <span className="user-name">ユーザー</span>
                        <span className="user-email">user@example.com</span>
                    </div>
                    <button className="settings-btn">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
