import React, { useState, useRef, useEffect } from 'react';

interface InputContainerProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const InputContainer: React.FC<InputContainerProps> = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="メッセージを入力してください..."
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
            <div className="input-info">
                ChatGPT Cloneは間違いを犯すことがあります。重要な情報は確認してください。
            </div>
        </div>
    );
};

export default InputContainer;
