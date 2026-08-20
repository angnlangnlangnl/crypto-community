import React from 'react';
import { FaHashtag, FaLock } from 'react-icons/fa';
import './ChannelList.css';

function ChannelList({ channels, selectedChannel, onChannelSelect }) {
  return (
    <div className="channel-list-container">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`channel-item ${selectedChannel?.id === channel.id ? 'active' : ''}`}
          onClick={() => onChannelSelect(channel)}
        >
          {channel.isPrivate ? <FaLock /> : <FaHashtag />}
          <span className="channel-name">{channel.name}</span>
          <span className="member-count">{channel.memberCount}</span>
        </div>
      ))}
    </div>
  );
}

export default ChannelList;
