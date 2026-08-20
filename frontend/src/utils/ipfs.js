// IPFS存储工具（简化版）
export const uploadToIPFS = async (data) => {
  try {
    // 这里使用简单的哈希替代IPFS
    const { ethers } = require('ethers');
    return ethers.utils.id(JSON.stringify(data));
  } catch (error) {
    console.error('IPFS上传失败:', error);
    throw error;
  }
};

export const fetchFromIPFS = async (hash) => {
  try {
    // 简化处理，实际项目中应该从IPFS网关获取
    return null;
  } catch (error) {
    console.error('IPFS获取失败:', error);
    throw error;
  }
};
