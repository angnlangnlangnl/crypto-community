import { useState, useCallback, useEffect } from 'react';

export function useChat(chatContract, tokenContract, account) {
  const [channels, setChannels] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 检查用户注册状态
  useEffect(() => {
    if (chatContract && account) {
      checkUserRegistration();
    }
  }, [chatContract, account]);

  const checkUserRegistration = async () => {
    try {
      const info = await chatContract.users(account);
      if (info.isRegistered) {
        setIsRegistered(true);
        setUserInfo(info);
        loadChannels();
      }
    } catch (error) {
      console.log('检查注册状态失败:', error);
    }
  };

  const loadChannels = useCallback(async () => {
    if (!chatContract || !account) return;

    setLoading(true);
    try {
      const userChannels = await chatContract.getUserChannels(account);
      const channelPromises = userChannels.map(async (id) => {
        const channel = await chatContract.channels(id);
        if (channel.isActive) {
          return {
            id: id.toNumber(),
            name: channel.name,
            description: channel.description,
            memberCount: channel.memberCount.toNumber(),
            isPrivate: channel.isPrivate
          };
        }
        return null;
      });
      
      const loadedChannels = (await Promise.all(channelPromises)).filter(Boolean);
      setChannels(loadedChannels);
    } catch (error) {
      console.error('加载频道失败:', error);
    } finally {
      setLoading(false);
    }
  }, [chatContract, account]);

  const registerUser = async (username) => {
    if (!chatContract || !account) {
      throw new Error('请先连接钱包');
    }

    setLoading(true);
    try {
      const tx = await chatContract.registerUser(username, '');
      await tx.wait();
      setIsRegistered(true);
      await checkUserRegistration();
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createChannel = async (channelData) => {
    if (!chatContract || !account) {
      throw new Error('请先连接钱包');
    }

    setLoading(true);
    try {
      // 检查是否需要授权
      const creationCost = await chatContract.channelCreationCost();
      if (creationCost > 0 && tokenContract) {
        const approveTx = await tokenContract.approve(
          await chatContract.getAddress(),
          creationCost
        );
        await approveTx.wait();
      }

      const tx = await chatContract.createChannel(
        channelData.name,
        channelData.description || '',
        channelData.isPrivate || false
      );
      await tx.wait();
      await loadChannels();
    } catch (error) {
      console.error('创建频道失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (channelId, content) => {
    if (!chatContract || !account) {
      throw new Error('请先连接钱包');
    }

    setLoading(true);
    try {
      const { ethers } = require('ethers');
      const contentHash = ethers.utils.id(content);
      const tx = await chatContract.sendMessage(channelId, contentHash);
      await tx.wait();
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    channels,
    isRegistered,
    userInfo,
    loading,
    registerUser,
    createChannel,
    sendMessage,
    loadChannels
  };
}
