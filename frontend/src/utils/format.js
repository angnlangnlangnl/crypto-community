export const formatAddress = (address, length = 6) => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-4)}`;
};

export const formatBalance = (value, decimals = 4) => {
  if (!value) return '0';
  return parseFloat(value).toFixed(decimals);
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN');
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
