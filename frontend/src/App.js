import React, { useState } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const channels = [
    { id: 1, name: '综合讨论' },
    { id: 2, name: '技术分析' },
    { id: 3, name: '项目动态' }
  ];

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        setSelectedChannel(channels[0]);
      } catch (error) {
        alert('连接失败：' + error.message);
      }
    } else {
      alert('请安装MetaMask钱包');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedChannel) {
      const msg = {
        id: Date.now(),
        sender: account ? account.slice(0, 6) : '匿名',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString()
      };
      setMessages([...messages, msg]);
      setNewMessage('');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <span className="logo">🚀 币圈社区</span>
        {account ? (
          <span className="account">✅ {account.slice(0, 6)}...{account.slice(-4)}</span>
        ) : (
          <button className="btn" onClick={connectWallet}>🔗 连接钱包</button>
        )}
      </header>

      {account ? (
        <div className="main">
          <aside className="sidebar">
            <h3>频道列表</h3>
            {channels.map(ch => (
              <div
                key={ch.id}
                className={`channel ${selectedChannel?.id === ch.id ? 'active' : ''}`}
                onClick={() => setSelectedChannel(ch)}
              >
                # {ch.name}
              </div>
            ))}
          </aside>

          <div className="chat">
            <div className="chatHeader">
              <h2># {selectedChannel?.name}</h2>
            </div>

            <div className="messages">
              {messages.length === 0 ? (
                <p className="empty">暂无消息，在下方输入框发送消息</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="msg">
                    <strong>{msg.sender}</strong>
                    <span className="time">{msg.time}</span>
                    <div className="text">{msg.text}</div>
                  </div>
                ))
              )}
            </div>

            <div className="inputBar">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`发送消息到 # ${selectedChannel?.name || '...'}`}
              />
              <button onClick={sendMessage} disabled={!newMessage.trim()}>
                发送
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="landing">
          <h1>🚀 欢迎来到币圈社区</h1>
          <p>连接钱包后即可进入聊天室</p>
          <button className="btn" onClick={connectWallet}>🔗 点击连接MetaMask钱包</button>
        </div>
      )}
    </div>
  );
}

export default App;
