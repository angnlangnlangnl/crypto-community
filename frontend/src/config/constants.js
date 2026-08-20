export const CONTRACT_ADDRESSES = {
  chat: localStorage.getItem('chatContractAddress') || '',
  token: localStorage.getItem('tokenContractAddress') || ''
};

export const NETWORK_CONFIG = {
  bscTestnet: {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545'
  },
  localhost: {
    chainId: 1337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545'
  }
};

export const TOKEN_CONFIG = {
  name: 'Chat Token',
  symbol: 'CHAT',
  decimals: 18,
  messageReward: 1,
  channelCreationCost: 100
};
