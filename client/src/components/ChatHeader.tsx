import React from 'react';
import { FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  recipient: string;
  name: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient, name }) => {
  const navigate = useNavigate();
  
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="chat-header-info">
          <h2>{name}</h2>
          <span className="status-indicator online"></span>
          <span className="status-text">Online</span>
        </div>
      </div>
      <div className="chat-header-actions">
        <button className="action-button">
          <FaEllipsisV />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
