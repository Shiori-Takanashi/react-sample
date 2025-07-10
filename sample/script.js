// DOM要素の取得
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const newChatBtn = document.querySelector('.new-chat-btn');
const chatHistory = document.querySelector('.chat-history');

// API設定
const API_BASE_URL = 'http://localhost:8000/api';
let currentChatId = null;
let chatsData = [];
let messagesData = [];
let userData = null;

// メッセージ送信機能
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // ユーザーメッセージを追加
    addMessage(message, 'user');

    // 入力フィールドをクリア
    messageInput.value = '';
    adjustTextareaHeight();

    // タイピングインジケーターを表示
    showTypingIndicator();

    // 模擬的なAI応答（実際のAPIではありません）
    setTimeout(() => {
        hideTypingIndicator();
        const responses = [
            "ご質問をありがとうございます。詳しく説明させていただきますね。",
            "なるほど、興味深いご質問ですね。以下のような点が考えられます：",
            "承知いたしました。この件については、いくつかのアプローチがあります。",
            "とても良い質問ですね。順を追って説明させていただきます。",
            "このトピックについて詳しく解説いたします。"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'assistant');
    }, 1500);
}

// メッセージを追加する関数
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '<span class="icon">👤</span>' : '<span class="icon">🤖</span>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;

    contentDiv.appendChild(textDiv);

    if (sender === 'assistant') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        actionsDiv.innerHTML = `
            <button class="action-btn" onclick="copyMessage(this)">
                <span class="icon">📋</span>
            </button>
            <button class="action-btn">
                <span class="icon">👍</span>
            </button>
            <button class="action-btn">
                <span class="icon">👎</span>
            </button>
            <button class="action-btn">
                <span class="icon">🔄</span>
            </button>
        `;
        contentDiv.appendChild(actionsDiv);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
    } else {
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(avatarDiv);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// タイピングインジケーター表示
function showTypingIndicator() {
    const typingDiv = document.querySelector('.typing');
    if (typingDiv) {
        typingDiv.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// タイピングインジケーター非表示
function hideTypingIndicator() {
    const typingDiv = document.querySelector('.typing');
    if (typingDiv) {
        typingDiv.style.display = 'none';
    }
}

// テキストエリアの高さを自動調整
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
}

// メッセージをコピーする関数
function copyMessage(button) {
    const messageText = button.closest('.message-content').querySelector('.message-text').textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<span class="icon">✅</span>';
        button.style.color = '#10a37f';

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
    });
}

// 新しいチャットボタンのクリックイベント
newChatBtn.addEventListener('click', () => {
    // チャット履歴をクリア
    const messages = chatMessages.querySelectorAll('.message:not(.typing)');
    messages.forEach(message => message.remove());

    // アクティブなチャットアイテムを変更
    chatItems.forEach(item => item.classList.remove('active'));

    // 新しいチャットアイテムを追加（実際のアプリでは動的に追加）
    console.log('新しいチャットを開始');
});

// 送信ボタンのクリックイベント
sendBtn.addEventListener('click', sendMessage);

// Enterキーでメッセージ送信（Shift+Enterで改行）
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// テキストエリアの入力イベント
messageInput.addEventListener('input', adjustTextareaHeight);

// チャット履歴のクリックイベント
chatItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn') && !e.target.closest('.delete-btn')) {
            chatItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // 実際のアプリでは、選択されたチャットの内容を読み込む
            console.log('チャットを選択:', item.querySelector('span').textContent);
        }
    });

    // 削除ボタンのイベント
    const deleteBtn = item.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            item.remove();
        });
    }
});

// レスポンシブ対応：モバイルでのサイドバー切り替え
const sidebar = document.querySelector('.sidebar');
let sidebarOpen = false;

// モバイルでサイドバーを開閉する関数（必要に応じて）
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        sidebarOpen = !sidebarOpen;
        sidebar.classList.toggle('open', sidebarOpen);
    }
}

// ウィンドウリサイズ時の処理
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        sidebarOpen = false;
    }
});

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    // 初期メッセージを表示
    setTimeout(() => {
        addMessage('こんにちは！何かお手伝いできることはありますか？', 'assistant');
    }, 1000);

    // テキストエリアにフォーカス
    messageInput.focus();
});

// ダークモード切り替え（将来的な拡張用）
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', !document.body.classList.contains('light-mode'));
}

// ローカルストレージからダークモード設定を読み込み
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'false') {
    document.body.classList.add('light-mode');
}

// モデル選択の変更イベント
const modelSelector = document.querySelector('.model-selector select');
modelSelector.addEventListener('change', (e) => {
    console.log('モデル変更:', e.target.value);
    // 実際のアプリでは、選択されたモデルに応じて処理を変更
});

// 設定ボタンのクリックイベント
const settingsBtn = document.querySelector('.settings-btn');
settingsBtn.addEventListener('click', () => {
    console.log('設定を開く');
    // 実際のアプリでは、設定モーダルを開く
});

// その他のアクションボタン
const shareBtn = document.querySelector('.chat-actions .action-btn');
shareBtn.addEventListener('click', () => {
    console.log('チャットを共有');
    // 実際のアプリでは、共有機能を実装
});

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    // Ctrl+K または Cmd+K で新しいチャット
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        newChatBtn.click();
    }

    // Ctrl+/ または Cmd+/ でショートカット一覧（将来的な拡張用）
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        console.log('ショートカット一覧を表示');
    }
});

// スムーズスクロール
function smoothScrollToBottom() {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}
