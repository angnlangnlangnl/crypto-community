import React from 'react';
import { FaFire } from 'react-icons/fa';
import './TrendingTopics.css';

function TrendingTopics() {
  const topics = [
    { tag: '#BTC', mentions: 12543 },
    { tag: '#ETH', mentions: 8932 },
    { tag: '#BNB', mentions: 6547 },
    { tag: '#DeFi', mentions: 4321 },
    { tag: '#NFT', mentions: 3210 }
  ];

  return (
    <div className="trending-topics">
      <h3><FaFire /> 热门话题</h3>
      <div className="topic-list">
        {topics.map((topic, index) => (
          <div key={index} className="topic-item">
            <span className="rank">#{index + 1}</span>
            <span className="tag">{topic.tag}</span>
            <span className="mentions">{topic.mentions.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingTopics;
