// グローバル変数
let chatData = null;
let currentSessionId = null;
let currentMessages = [];

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', function () {
    loadChatData();
    setupEventListeners();
});

// JSONデータを読み込む
async function loadChatData() {
    try {
        // 直接読み込まれたデータを使用
        if (window.SAMPLE_DATA) {
            chatData = window.SAMPLE_DATA;
            console.log('JavaScriptファイルからデータを読み込み:', chatData);
            initializeChatHistory();

            // 最初のセッションを自動選択
            if (chatData.sessions.length > 0) {
                selectSession(chatData.sessions[0].id);
            }
            return;
        }

        // フォールバック: fetchを試行
        const response = await fetch('data/sample.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        chatData = await response.json();
        console.log('JSONファイルからデータを読み込み:', chatData);
        initializeChatHistory();

        // 最初のセッションを自動選択
        if (chatData.sessions.length > 0) {
            selectSession(chatData.sessions[0].id);
        }
    } catch (error) {
        console.error('データの読み込みに失敗:', error);

        // 最後のフォールバック: 埋め込みデータを使用
        console.log('フォールバック: 埋め込みデータを使用');
        loadFallbackData();
    }
}

// フォールバック用のデータ読み込み
function loadFallbackData() {
    chatData = {
        "sessions": [
            {
                "id": 1,
                "title": "これはフォールバックです",
                "created_at": "2025-07-10 10:00:00.000000",
                "updated_at": "2025-07-10 10:05:00.000000"
            },
            {
                "id": 2,
                "title": "プロジェクト相談",
                "created_at": "2025-07-10 11:00:00.000000",
                "updated_at": "2025-07-10 11:12:00.000000"
            }
        ],
        "messages": [
            {
                "id": 1,
                "session_id": 1,
                "role": "user",
                "content": "こんにちは。",
                "timestamp": "2025-07-10 10:00:05.000000"
            },
            {
                "id": 2,
                "session_id": 1,
                "role": "assistant",
                "content": "こんにちは。今日は何をしましょうか？",
                "timestamp": "2025-07-10 10:00:06.000000"
            },
            {
                "id": 3,
                "session_id": 1,
                "role": "user",
                "content": "自己紹介してください。",
                "timestamp": "2025-07-10 10:01:00.000000"
            },
            {
                "id": 4,
                "session_id": 1,
                "role": "assistant",
                "content": "私はOpenAIが開発したAIアシスタントです。",
                "timestamp": "2025-07-10 10:01:01.000000"
            },
            {
                "id": 5,
                "session_id": 2,
                "role": "user",
                "content": "ReactでチャットUIを作りたいんだけど",
                "timestamp": "2025-07-10 11:00:00.000000"
            },
            {
                "id": 6,
                "session_id": 2,
                "role": "assistant",
                "content": "もちろん。どういった構成を考えていますか？",
                "timestamp": "2025-07-10 11:00:02.000000"
            },
            {
                "id": 7,
                "session_id": 2,
                "role": "user",
                "content": "OpenAI APIと連携して、会話を保存したい",
                "timestamp": "2025-07-10 11:10:00.000000"
            },
            {
                "id": 8,
                "session_id": 2,
                "role": "assistant",
                "content": "SQLiteでセッションとメッセージを管理する構成が良いでしょう。",
                "timestamp": "2025-07-10 11:12:00.000000"
            }
        ],
        "settings": [
            {
                "id": 1,
                "session_id": 1,
                "model": "gpt-3.5-turbo",
                "temperature": 1.0,
                "top_p": 1.0
            },
            {
                "id": 2,
                "session_id": 2,
                "model": "gpt-4",
                "temperature": 0.7,
                "top_p": 1.0
            }
        ]
    };

    console.log('フォールバックデータの読み込み完了:', chatData);
    initializeChatHistory();

    // 最初のセッションを自動選択
    if (chatData.sessions.length > 0) {
        selectSession(chatData.sessions[0].id);
    }
}

// チャット履歴を初期化
function initializeChatHistory() {
    // ローディングメッセージを隠す
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }

    const chatHistoryElement = document.getElementById('chatHistory');
    chatHistoryElement.innerHTML = '';

    chatData.sessions.forEach(session => {
        const chatItem = createChatHistoryItem(session);
        chatHistoryElement.appendChild(chatItem);
    });
}

// チャット履歴アイテムを作成
function createChatHistoryItem(session) {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.sessionId = session.id;

    // 最初のメッセージからタイトルを取得、なければデフォルトタイトル
    const title = session.title || `チャット ${session.id}`;

    chatItem.innerHTML = `
        <i class="fas fa-comment"></i>
        <span title="${title}">${title}</span>
        <button class="delete-btn" onclick="deleteSession(${session.id}, event)">
            <i class="fas fa-trash"></i>
        </button>
    `;

    chatItem.addEventListener('click', () => selectSession(session.id));

    return chatItem;
}

// セッションを選択
function selectSession(sessionId) {
    currentSessionId = sessionId;

    // アクティブなチャットアイテムを更新
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeItem = document.querySelector(`[data-session-id="${sessionId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // セッションに関連するメッセージを取得
    currentMessages = chatData.messages.filter(msg => msg.session_id === sessionId);

    // セッションの設定を取得
    const sessionSettings = chatData.settings.find(setting => setting.session_id === sessionId);
    if (sessionSettings) {
        document.getElementById('modelSelect').value = sessionSettings.model;
    }

    // チャットコンテナを更新
    updateChatContainer();
}

// チャットコンテナを更新
function updateChatContainer() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';

    currentMessages.forEach(message => {
        const messageElement = createMessageElement(message);
        chatContainer.appendChild(messageElement);
    });

    // 最新メッセージまでスクロール
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// メッセージ要素を作成
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`;

    const avatarLetter = message.role === 'user' ? 'U' : 'A';
    const avatarColor = message.role === 'user' ? '#10a37f' : '#ab68ff';

    messageDiv.innerHTML = `
        <div class="message-avatar" style="background-color: ${avatarColor}">
            ${avatarLetter}
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessageContent(message.content)}</div>
            <div class="message-actions">
                <button class="action-btn" onclick="copyMessage(this)">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn" onclick="shareMessage(this)">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `;

    return messageDiv;
}

// メッセージ内容をフォーマット
function formatMessageContent(content) {
    // 改行を<br>に変換
    return content.replace(/\n/g, '<br>');
}

// 新しいチャットを作成
function createNewChat() {
    const newSessionId = Math.max(...chatData.sessions.map(s => s.id)) + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 26);

    const newSession = {
        id: newSessionId,
        title: `新しいチャット ${newSessionId}`,
        created_at: now,
        updated_at: now
    };

    chatData.sessions.push(newSession);

    // 新しいセッションの設定を追加
    const newSettings = {
        id: newSessionId,
        session_id: newSessionId,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        top_p: 1.0
    };

    chatData.settings.push(newSettings);

    // UIを更新
    initializeChatHistory();
    selectSession(newSessionId);
}

// メッセージを送信
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();

    if (!content || !currentSessionId) return;

    // ユーザーメッセージを追加
    const userMessage = {
        id: Math.max(...chatData.messages.map(m => m.id)) + 1,
        session_id: currentSessionId,
        role: 'user',
        content: content,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 26)
    };

    chatData.messages.push(userMessage);
    currentMessages.push(userMessage);

    // 入力フィールドをクリア
    messageInput.value = '';

    // UIを更新
    updateChatContainer();

    // タイピングインジケーターを表示
    showTypingIndicator();

    // 模擬的なAIレスポンスを生成
    setTimeout(() => {
        generateAIResponse(content);
    }, 1000 + Math.random() * 2000);
}

// タイピングインジケーターを表示
function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message';
    typingDiv.id = 'typing-indicator';

    typingDiv.innerHTML = `
        <div class="message-avatar" style="background-color: #ab68ff">A</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// AIレスポンスを生成（模擬）
function generateAIResponse(userMessage) {
    const responses = [
        "それは興味深い質問ですね。詳しく説明していただけますか？",
        "理解しました。その件について詳しく調べてみましょう。",
        "はい、お手伝いします。具体的にどのような情報が必要でしょうか？",
        "そうですね。いくつかの選択肢を提案させていただきます。",
        "良いアイデアですね。実装方法を考えてみましょう。",
        "なるほど。他にも考慮すべき点があるかもしれません。"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // タイピングインジケーターを削除
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }

    // AIメッセージを追加
    const aiMessage = {
        id: Math.max(...chatData.messages.map(m => m.id)) + 1,
        session_id: currentSessionId,
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 26)
    };

    chatData.messages.push(aiMessage);
    currentMessages.push(aiMessage);

    // UIを更新
    updateChatContainer();

    // セッションのupdated_atを更新
    const session = chatData.sessions.find(s => s.id === currentSessionId);
    if (session) {
        session.updated_at = aiMessage.timestamp;
    }
}

// キーボードイベントハンドラー
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// セッションを削除
function deleteSession(sessionId, event) {
    event.stopPropagation();

    if (confirm('このチャットを削除しますか？')) {
        // セッションを削除
        chatData.sessions = chatData.sessions.filter(s => s.id !== sessionId);

        // 関連するメッセージを削除
        chatData.messages = chatData.messages.filter(m => m.session_id !== sessionId);

        // 関連する設定を削除
        chatData.settings = chatData.settings.filter(s => s.session_id !== sessionId);

        // UIを更新
        initializeChatHistory();

        // 削除したセッションが現在のセッションの場合
        if (currentSessionId === sessionId) {
            if (chatData.sessions.length > 0) {
                selectSession(chatData.sessions[0].id);
            } else {
                currentSessionId = null;
                document.getElementById('chatContainer').innerHTML = '';
            }
        }
    }
}

// チャットをクリア
function clearChat() {
    if (currentSessionId && confirm('現在のチャットをクリアしますか？')) {
        // 現在のセッションのメッセージを削除
        chatData.messages = chatData.messages.filter(m => m.session_id !== currentSessionId);
        currentMessages = [];

        // UIを更新
        updateChatContainer();
    }
}

// チャットをエクスポート
function exportChat() {
    if (!currentSessionId) return;

    const session = chatData.sessions.find(s => s.id === currentSessionId);
    const messages = currentMessages;

    const exportData = {
        session: session,
        messages: messages
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `chat_${session.title}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
}

// メッセージをコピー
function copyMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        // 一時的にボタンのアイコンを変更
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check';
        setTimeout(() => {
            icon.className = originalClass;
        }, 1000);
    });
}

// メッセージを共有
function shareMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;

    // 共有モーダルを表示
    showShareModal(messageText);
}

// 共有モーダルを表示
function showShareModal(messageText) {
    const shareModal = document.getElementById('shareModal');
    const shareMessageText = document.getElementById('shareMessageText');

    shareMessageText.textContent = messageText;
    shareModal.classList.add('show');

    // 現在共有するメッセージを保存
    shareModal.dataset.currentMessage = messageText;
}

// 共有モーダルを閉じる
function closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    shareModal.classList.remove('show');
}

// メールで共有
function shareViaEmail() {
    const shareModal = document.getElementById('shareModal');
    const messageText = shareModal.dataset.currentMessage;

    const subject = encodeURIComponent('ChatGPT Clone - 共有メッセージ');
    const body = encodeURIComponent(`ChatGPT Cloneから共有されたメッセージ:\n\n${messageText}`);

    window.open(`mailto:?subject=${subject}&body=${body}`);
    closeShareModal();
}

// クリップボードにコピー
function shareViaClipboard() {
    const shareModal = document.getElementById('shareModal');
    const messageText = shareModal.dataset.currentMessage;

    navigator.clipboard.writeText(messageText).then(() => {
        // 成功メッセージを表示
        showShareSuccess('クリップボードにコピーしました');
    }).catch(() => {
        // エラーメッセージを表示
        showShareError('クリップボードへのコピーに失敗しました');
    });
}

// システム共有（従来のnavigator.share）
function shareViaSystem() {
    const shareModal = document.getElementById('shareModal');
    const messageText = shareModal.dataset.currentMessage;

    if (navigator.share) {
        navigator.share({
            title: 'ChatGPT Clone - メッセージ',
            text: messageText
        }).then(() => {
            closeShareModal();
        }).catch(() => {
            showShareError('システム共有に失敗しました');
        });
    } else {
        showShareError('このブラウザはシステム共有をサポートしていません');
    }
}

// ファイルとして保存
function shareAsFile() {
    const shareModal = document.getElementById('shareModal');
    const messageText = shareModal.dataset.currentMessage;

    const blob = new Blob([messageText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chatgpt-message-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    link.click();

    showShareSuccess('ファイルをダウンロードしました');
}

// 共有成功メッセージを表示
function showShareSuccess(message) {
    const shareModal = document.getElementById('shareModal');
    const successDiv = document.createElement('div');
    successDiv.className = 'share-success';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10a37f;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
        closeShareModal();
    }, 2000);
}

// 共有エラーメッセージを表示
function showShareError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'share-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ff4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// エラーメッセージを表示
function showError(message) {
    const chatContainer = document.getElementById('chatContainer');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    chatContainer.appendChild(errorDiv);
}

// イベントリスナーを設定
function setupEventListeners() {
    // テキストエリアの自動リサイズ
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    // モデル選択の変更
    document.getElementById('modelSelect').addEventListener('change', function () {
        if (currentSessionId) {
            const setting = chatData.settings.find(s => s.session_id === currentSessionId);
            if (setting) {
                setting.model = this.value;
            }
        }
    });

    // 共有モーダルの外側クリックで閉じる
    document.getElementById('shareModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeShareModal();
        }
    });
}
