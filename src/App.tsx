import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import InputContainer from './components/InputContainer';
import ShareModal from './components/ShareModal';
import { SAMPLE_DATA } from './data/sampleData';
import type { Message, Session, ChatData } from './types';

function App() {
  const [chatData, setChatData] = useState<ChatData>(SAMPLE_DATA);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; message?: string }>({
    isOpen: false,
    message: undefined,
  });

  // 初期化
  useEffect(() => {
    if (chatData.sessions.length > 0) {
      setCurrentSessionId(chatData.sessions[0].id);
    }
  }, [chatData]);

  // 現在のセッションのメッセージを取得
  useEffect(() => {
    if (currentSessionId !== null) {
      const messages = chatData.messages.filter(
        message => message.session_id === currentSessionId
      );
      setCurrentMessages(messages);
    }
  }, [currentSessionId, chatData]);

  // セッション選択
  const handleSessionSelect = (sessionId: number) => {
    setCurrentSessionId(sessionId);
  };

  // 新しいチャット作成
  const handleNewChat = () => {
    const newSession: Session = {
      id: Date.now(),
      title: '新しいチャット',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setChatData(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));
    setCurrentSessionId(newSession.id);
  };

  // セッション削除
  const handleSessionDelete = (sessionId: number) => {
    setChatData(prev => ({
      sessions: prev.sessions.filter(session => session.id !== sessionId),
      messages: prev.messages.filter(message => message.session_id !== sessionId),
    }));

    if (currentSessionId === sessionId) {
      const remainingSessions = chatData.sessions.filter(session => session.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  // メッセージ送信
  const handleSendMessage = (content: string) => {
    if (!currentSessionId) return;

    const userMessage: Message = {
      id: Date.now(),
      session_id: currentSessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // ユーザーメッセージを追加
    setChatData(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // セッションタイトルを更新（最初のメッセージの場合）
    if (currentMessages.length === 0) {
      const sessionTitle = content.length > 30 ? content.substring(0, 30) + '...' : content;
      setChatData(prev => ({
        ...prev,
        sessions: prev.sessions.map(session =>
          session.id === currentSessionId
            ? { ...session, title: sessionTitle, updated_at: new Date().toISOString() }
            : session
        ),
      }));
    }

    // AIレスポンスをシミュレート
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        session_id: currentSessionId,
        role: 'assistant',
        content: `「${content}」についてお答えします。これはサンプルレスポンスです。`,
        timestamp: new Date().toISOString(),
      };

      setChatData(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));
      setIsLoading(false);
    }, 1000);
  };

  // チャットクリア
  const handleClearChat = () => {
    if (currentSessionId) {
      setChatData(prev => ({
        ...prev,
        messages: prev.messages.filter(message => message.session_id !== currentSessionId),
      }));
    }
  };

  // チャットエクスポート
  const handleExportChat = () => {
    if (currentMessages.length === 0) return;

    const exportData = currentMessages.map(message => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 共有モーダル
  const handleShare = (message: string) => {
    setShareModal({ isOpen: true, message });
  };

  const handleCloseShareModal = () => {
    setShareModal({ isOpen: false, message: undefined });
  };

  return (
    <div className="app-container">
      <Sidebar
        sessions={chatData.sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
        onSessionDelete={handleSessionDelete}
      />
      <main className="main-content">
        <ChatHeader
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
        />
        <ChatContainer
          messages={currentMessages}
          isLoading={isLoading}
          onShare={handleShare}
        />
        <InputContainer
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={handleCloseShareModal}
        message={shareModal.message}
      />
    </div>
  );
}

export default App;
