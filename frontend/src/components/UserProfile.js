import React from 'react';
import { FaCoins, FaStar } from 'react-icons/fa';
import './UserProfile.css';

function UserProfile({ account, userInfo, tokenBalance }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar">
          {userInfo?.username?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h3>{userInfo?.username || '未设置用户名'}</h3>
          <p>{formatAddress(account)}</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item">
          <FaCoins />
          <span>{parseFloat(tokenBalance).toFixed(2)} CHAT</span>
        </div>
        <div className="stat-item">
          <FaStar />
          <span>{userInfo?.reputation?.toString() || '0'} 信誉</span>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
