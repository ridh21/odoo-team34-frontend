import React, { useState } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="message-input-container">
      <button className="input-action-button">
        <FaPaperclip />
      </button>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="button" className="emoji-button">
          <FaSmile />
        </button>
      </form>
      
      <button 
        className={`send-button ${message.trim() ? 'active' : ''}`}
        onClick={handleSubmit}
        disabled={!message.trim()}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default MessageInput;
