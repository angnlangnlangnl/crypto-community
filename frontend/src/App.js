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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
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
    setMessages([]);
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedChannel) {
      const msg = {
        id: Date.now(),
        sender: account ? account.slice(0, 6) + '...' + account.slice(-4) : '匿名',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString('zh-CN')
      };
      setMessages([...messages, msg]);
      setNewMessage('');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🚀 币圈社区</div>
        <div className="header-right">
          {isConnected ? (
            <>
              <span className="account-address">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button className="btn-disconnect" onClick={disconnectWallet}>
                断开连接
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
            <h3>频道列表</h3>
            {channels.map(channel => (
              <div
                key={channel.id}
                className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
                onClick={() => setSelectedChannel(channel)}
              >
                <span># {channel.name}</span>
                <span className="member-count">{channel.members}</span>
              </div>
            ))}
          </aside>

          <div className="chat-area">
            {selectedChannel ? (
              <>
                <div className="chat-header">
                  <h2># {selectedChannel.name}</h2>
                  <span>{selectedChannel.members} 成员</span>
                </div>
                <div className="messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>💬 暂无消息</p>
                      <p>发送第一条消息吧！</p>
                    </div>
                  ) : (
                    messages.map(msg => (
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
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={`发送消息到 # ${selectedChannel.name}...`}
                  />
                  <button onClick={sendMessage} disabled={!newMessage.trim()}>
                    发送
                  </button>
                </div>
              </>
            ) : (
              <div className="welcome">
                <h2>👈 选择一个频道开始聊天</h2>
                <p>点击左侧频道列表进入讨论</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="landing">
          <h1>欢迎来到币圈社区</h1>
          <p>连接钱包开始使用去中心化聊天</p>
          <button className="connect-btn-large" onClick={connectWallet}>
            🔗 连接MetaMask钱包
          </button>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div className="feature-title">去中心化聊天</div>
              <div className="feature-desc">基于BSC链的消息传递，安全可靠</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <div className="feature-title">代币奖励</div>
              <div className="feature-desc">活跃参与获得CHAT代币激励</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <div className="feature-title">社区治理</div>
              <div className="feature-desc">DAO模式，社区成员共同决策</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
