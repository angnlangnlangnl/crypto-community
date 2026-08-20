import React, { useState } from 'react';
import { FaTimes, FaLock, FaGlobe } from 'react-icons/fa';
import './CreateChannelModal.css';

function CreateChannelModal({ onClose, onCreate }) {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (channelName.trim().length < 3) {
      alert('频道名称至少3个字符');
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        name: channelName.trim(),
        description: description.trim(),
        isPrivate
      });
    } catch (error) {
      console.error('创建失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>创建新频道</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>频道名称 *</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="输入频道名称"
              maxLength={30}
              required
            />
          </div>

          <div className="form-group">
            <label>频道描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述频道主题"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label>频道类型</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-option ${!isPrivate ? 'active' : ''}`}
                onClick={() => setIsPrivate(false)}
              >
                <FaGlobe />
                <span>公开</span>
              </button>
              <button
                type="button"
                className={`type-option ${isPrivate ? 'active' : ''}`}
                onClick={() => setIsPrivate(true)}
              >
                <FaLock />
                <span>私有</span>
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>取消</button>
            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? '创建中...' : '创建频道'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannelModal;
