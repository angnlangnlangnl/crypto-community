import React from 'react';
import { FaPlus, FaHashtag } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ channels, selectedChannel, onChannelSelect, onCreateChannel, isConnected }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>频道列表</h3>
        {isConnected && (
          <button className="create-btn" onClick={onCreateChannel}>
            <FaPlus />
          </button>
        )}
      </div>
      
      <div className="channel-list">
        {channels.length === 0 ? (
          <div className="empty">
            <p>暂无频道</p>
            {isConnected && (
              <button onClick={onCreateChannel}>创建第一个频道</button>
            )}
          </div>
        ) : (
          channels.map((channel) => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
              onClick={() => onChannelSelect(channel)}
            >
              <FaHashtag />
              <span>{channel.name}</span>
              <span className="member-count">{channel.memberCount}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
