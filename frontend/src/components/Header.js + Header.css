import React from 'react';
import { FaWallet, FaCoins } from 'react-icons/fa';
import './Header.css';

function Header({ isConnected, account, tokenBalance, onConnect, onDisconnect }) {
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="logo">
        <FaCoins className="logo-icon" />
        <span>🚀 币圈社区</span>
      </div>
      
      <div className="header-right">
        {isConnected ? (
          <>
            <div className="balance">
              <FaCoins />
              <span>{parseFloat(tokenBalance).toFixed(2)} CHAT</span>
            </div>
            <span className="account">{formatAddress(account)}</span>
            <button className="btn" onClick={onDisconnect}>断开</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={onConnect}>
            <FaWallet /> 连接钱包
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
