import React, { useState } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { useWeb3 } from './hooks/useWeb3';
import { useChat } from './hooks/useChat';

function App() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  
  const {
    account,
    connectWallet,
    disconnectWallet,
    chatContract,
    tokenContract,
    isConnected
  } = useWeb3();
  
  const {
    channels,
    isRegistered,
    userInfo,
    registerUser,
    createChannel,
    sendMessage,
    loadChannels
  } = useChat(chatContract, tokenContract, account);

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('钱包连接成功！');
    } catch (error) {
      toast.error('连接失败：' + error.message);
    }
  };

  const handleCreateChannel = async (channelData) => {
    try {
      await createChannel(channelData);
      toast.success('频道创建成功！');
      setShowCreateChannel(false);
      loadChannels();
    } catch (error) {
      toast.error('创建失败：' + error.message);
    }
  };

  return (
    <div className="app">
      <Header 
        isConnected={isConnected}
        account={account}
        onConnect={handleConnect}
        onDisconnect={disconnectWallet}
      />
      
      <div className="main-content">
        <Sidebar
          channels={channels}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
          onCreateChannel={() => setShowCreateChannel(true)}
          isConnected={isConnected}
        />
        
        <ChatArea
          channel={selectedChannel}
          account={account}
          isRegistered={isRegistered}
          userInfo={userInfo}
          onRegister={registerUser}
          onSendMessage={sendMessage}
        />
      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
