import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './MessageInput.css';

function MessageInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="输入消息..."
        disabled={disabled}
      />
      <button 
        className="send-btn"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}

export default MessageInput;
