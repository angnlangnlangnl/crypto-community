import React, { useState } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [channels] = useState([
    { id: 1, name: '综合讨论', members: 125 },
    { id: 2, name: '技术分析', members: 89 },
    { id: 3, name: '项目动态', members: 67 },
    { id: 4, name: '空投活动', members: 45 }
  ]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        setSelectedChannel(channels[0]);
      } catch (error) {
        alert('连接失败：' + error.message);
      }
    } else {
      alert('请安装MetaMask钱包');
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setSelectedChannel(null);
    setMessages({});
  };

  const selectChannel = (channel) => {
    setSelectedChannel(channel);
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedChannel) {
      const channelId = selectedChannel.id;
      const msg = {
        id: Date.now(),
        sender: account ? account.slice(0, 6) + '...' + account.slice(-4) : '匿名',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString('zh-CN')
      };
      
      setMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), msg]
      }));
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const currentMessages = selectedChannel ? (messages[selectedChannel.id] || []) : [];

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🚀 币圈社区</div>
        <div className="header-right">
          {isConnected ? (
            <>
              <span className="account-address">
                ✅ {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button className="btn-disconnect" onClick={disconnectWallet}>
                断开
              </button>
            </>
          ) : (
            <button className="connect-btn" onClick={connectWallet}>
              🔗 连接钱包
            </button>
          )}
        </div>
      </header>

      {isConnected ? (
        <div className="main-content">
          <aside className="sidebar">
            <h3>📢 频道列表</h3>
            {channels.map(channel => (
              <div
                key={channel.id}
                className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
                onClick={() => selectChannel(channel)}
              >
                <span># {channel.name}</span>
                <span className="member-count">{channel.members}人</span>
              </div>
            ))}
          </aside>

          <div className="chat-area">
            <div className="chat-header">
              <h2># {selectedChannel ? selectedChannel.name : '选择频道'}</h2>
              <span>{selectedChannel ? selectedChannel.members : 0} 成员</span>
            </div>

            <div className="messages-container">
              {currentMessages.length === 0 ? (
                <div className="no-messages">
                  <p style={{fontSize: '48px', marginBottom: '15px'}}>💬</p>
                  <p style={{fontSize: '18px', marginBottom: '10px'}}>暂无消息</p>
                  <p>在下方输入框发送第一条消息吧！</p>
                </div>
              ) : (
                currentMessages.map(msg => (
                  <div key={msg.id} className="message">
                    <div className="message-avatar">
                      {msg.sender.slice(0, 2)}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <strong>{msg.sender}</strong>
                        <small>{msg.time}</small>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 消息输入框 - 确保始终显示 */}
            <div className="message-input-bar">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`发送消息到 # ${selectedChannel ? selectedChannel.name : '...'}`}
                className="message-input-field"
              />
              <button 
                onClick={sendMessage} 
                disabled={!newMessage.trim()}
                className="send-button"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="landing">
          <h1>🚀 欢迎来到币圈社区</h1>
          <p>连接钱包后即可进入聊天室</p>
          <button className="connect-btn-large" onClick={connectWallet}>
            🔗 点击连接MetaMask钱包
          </button>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <span>安装MetaMask钱包</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span>点击连接钱包按钮</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span>自动进入聊天室</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
