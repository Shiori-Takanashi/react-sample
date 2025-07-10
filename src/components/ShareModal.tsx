import React from 'react';
import type { ShareModalProps } from '../types';

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    const shareViaEmail = () => {
        const subject = encodeURIComponent('ChatGPT Clone - メッセージ');
        const body = encodeURIComponent(message || '');
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const shareViaClipboard = async () => {
        try {
            await navigator.clipboard.writeText(message || '');
            alert('クリップボードにコピーしました');
        } catch (err) {
            console.error('クリップボードへのコピーに失敗しました:', err);
        }
    };

    const shareViaSystem = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'ChatGPT Clone',
                    text: message || '',
                });
            } catch (err) {
                console.error('共有に失敗しました:', err);
            }
        } else {
            shareViaClipboard();
        }
    };

    const shareAsFile = () => {
        const blob = new Blob([message || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-message.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="share-modal" onClick={onClose}>
            <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="share-modal-header">
                    <h3>メッセージを共有</h3>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="share-modal-body">
                    <div className="share-message-preview">
                        <div className="share-message-text">{message}</div>
                    </div>
                    <div className="share-options">
                        <div className="share-option" onClick={shareViaEmail}>
                            <i className="fas fa-envelope"></i>
                            <span>メールで共有</span>
                        </div>
                        <div className="share-option" onClick={shareViaClipboard}>
                            <i className="fas fa-copy"></i>
                            <span>クリップボードにコピー</span>
                        </div>
                        <div className="share-option" onClick={shareViaSystem}>
                            <i className="fas fa-share-alt"></i>
                            <span>システム共有</span>
                        </div>
                        <div className="share-option" onClick={shareAsFile}>
                            <i className="fas fa-file-download"></i>
                            <span>ファイルとして保存</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
