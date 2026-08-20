import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './ChatArea.css';

function ChatArea({ channel, account, isRegistered, userInfo, onRegister, onSendMessage }) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !channel) return;
    
    setLoading(true);
    try {
      await onSendMessage(channel.id, message.trim());
      setMessage('');
    } catch (error) {
      alert('发送失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (username.trim().length < 3) {
      alert('用户名至少3个字符');
      return;
    }
    
    setLoading(true);
    try {
      await onRegister(username.trim());
      setShowRegister(false);
    } catch (error) {
      alert('注册失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!channel) {
    return (
      <div className="chat-area empty">
        <div className="empty-chat">
          <h2>选择一个频道开始聊天</h2>
          <p>加入社区，与其他币圈爱好者交流</p>
        </div>
      </div>
    );
  }

  if (!isRegistered && !showRegister) {
    return (
      <div className="chat-area empty">
        <div className="register-prompt">
          <h2>注册成为社区成员</h2>
          <p>注册后即可参与聊天并获得代币奖励</p>
          <button className="btn-primary" onClick={() => setShowRegister(true)}>
            立即注册
          </button>
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="chat-area empty">
        <div className="register-form">
          <h2>设置用户名</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="输入用户名（3-20字符）"
            maxLength={20}
          />
          <div className="form-actions">
            <button onClick={() => setShowRegister(false)}>取消</button>
            <button 
              className="btn-primary"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h2># {channel.name}</h2>
        <span>{channel.memberCount} 成员</span>
      </div>
      
      <div className="messages-container">
        <div className="no-messages">
          <p>暂无消息，发送第一条消息吧！</p>
        </div>
      </div>
      
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
        />
        <button 
          className="send-btn"
          onClick={handleSend}
          disabled={loading || !message.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
