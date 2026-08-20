import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

const CHAT_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

const CHAT_ABI = [
  "function registerUser(string memory _username, string memory _avatarHash) external",
  "function createChannel(string memory _name, string memory _description, bool _isPrivate) external returns (uint256)",
  "function joinChannel(uint256 _channelId) external",
  "function sendMessage(uint256 _channelId, string memory _contentHash) external",
  "function getUserChannels(address _user) external view returns (uint256[] memory)",
  "function channels(uint256) external view returns (uint256 id, string name, string description, address creator, uint256 memberCount, bool isPrivate, bool isActive, uint256 createdAt)",
  "function users(address) external view returns (address wallet, string username, string avatarHash, uint256 reputation, bool isRegistered, uint256 createdAt)"
];

export function useWeb3() {
  const [account, setAccount] = useState(null);
  const [chatContract, setChatContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask钱包');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setIsConnected(true);

      // 从localStorage获取合约地址
      const chatAddress = localStorage.getItem('chatContractAddress');
      const tokenAddress = localStorage.getItem('tokenContractAddress');

      if (chatAddress && tokenAddress) {
        const chat = new ethers.Contract(chatAddress, CHAT_ABI, signer);
        const token = new ethers.Contract(tokenAddress, CHAT_TOKEN_ABI, signer);
        
        setChatContract(chat);
        setTokenContract(token);

        try {
          const balance = await token.balanceOf(address);
          setTokenBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.log('获取余额失败:', error);
        }
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChatContract(null);
    setTokenContract(null);
    setIsConnected(false);
    setTokenBalance('0');
  }, []);

  const setContractAddresses = useCallback((chatAddress, tokenAddress) => {
    localStorage.setItem('chatContractAddress', chatAddress);
    localStorage.setItem('tokenContractAddress', tokenAddress);
  }, []);

  return {
    account,
    chatContract,
    tokenContract,
    isConnected,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    setContractAddresses
  };
}
