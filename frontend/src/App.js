import React, { useState } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [channels, setChannels] = useState([
    { id: 1, name: '综合讨论', members: 125 },
    { id: 2, name: '技术分析', members: 89 },
    { id: 3, name: '项目动态', members: 67 }
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
        text: newMessage,
        time: new Date().toLocaleTimeString()
      };
      setMessages([...messages, msg]);
      setNewMessage('');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🚀 币圈社区</div>
        <button className="connect-btn" onClick={connectWallet}>
          {account ? `✅ ${account.slice(0, 6)}...${account.slice(-4)}` : '🔗 连接钱包'}
        </button>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <h3>频道列表</h3>
          {channels.map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
              onClick={() => setSelectedChannel(channel)}
            >
              # {channel.name}
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
                  <p className="no-messages">暂无消息，发送第一条消息吧！</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="message">
                      <strong>{msg.sender}</strong>
                      <span>{msg.text}</span>
                      <small>{msg.time}</small>
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
                  placeholder="输入消息..."
                />
                <button onClick={sendMessage}>发送</button>
              </div>
            </>
          ) : (
            <div className="welcome">
              <h2>选择一个频道开始聊天</h2>
              <p>连接钱包后即可参与讨论</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
