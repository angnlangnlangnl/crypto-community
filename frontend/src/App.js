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
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: 'white' }}>
      {/* 头部 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '15px 20px',
        background: '#16213e',
        borderBottom: '1px solid #2d2d44'
      }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f7931a' }}>🚀 币圈社区</span>
        {account ? (
          <span style={{ color: '#00c853' }}>✅ {account.slice(0, 6)}...{account.slice(-4)}</span>
        ) : (
          <button 
            onClick={connectWallet}
            style={{
              padding: '10px 20px',
              background: '#f7931a',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔗 连接钱包
          </button>
        )}
      </div>

      {account ? (
        <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
          {/* 侧边栏 */}
          <div style={{
            width: '200px',
            background: '#16213e',
            padding: '15px',
            borderRight: '1px solid #2d2d44'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '15px' }}>频道列表</h3>
            {channels.map(channel => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                style={{
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedChannel?.id === channel.id ? '#f7931a' : 'transparent',
                  color: selectedChannel?.id === channel.id ? 'white' : '#b0b0b0'
                }}
              >
                # {channel.name}
              </div>
            ))}
          </div>

          {/* 聊天区域 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 聊天头部 */}
            <div style={{
              padding: '15px 20px',
              background: '#16213e',
              borderBottom: '1px solid #2d2d44'
            }}>
              <h2 style={{ fontSize: '16px' }}># {selectedChannel?.name}</h2>
            </div>

            {/* 消息列表 */}
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                  暂无消息，在下方输入框发送消息
                </p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{
                    padding: '10px',
                    background: '#16213e',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <strong style={{ color: '#f7931a', fontSize: '12px' }}>{msg.sender}</strong>
                    <span style={{ fontSize: '10px', color: '#666', marginLeft: '10px' }}>{msg.time}</span>
                    <div style={{ marginTop: '5px', fontSize: '14px' }}>{msg.text}</div>
                  </div>
                ))
              )}
            </div>

            {/* 消息输入框 - 使用内联样式确保显示 */}
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '15px 20px',
              background: '#16213e',
              borderTop: '1px solid #2d2d44'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`发送消息到 # ${selectedChannel?.name || '...'}`}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  background: '#0f3460',
                  border: '1px solid #2d2d44',
                  borderRadius: '25px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: '12px 24px',
                  background: '#f7931a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 60px)',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#f7931a', marginBottom: '15px' }}>🚀 欢迎来到币圈社区</h1>
          <p style={{ color: '#b0b0b0', marginBottom: '25px' }}>连接钱包后即可进入聊天室</p>
          <button
            onClick={connectWallet}
            style={{
              padding: '15px 35px',
              background: '#f7931a',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔗 点击连接MetaMask钱包
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
