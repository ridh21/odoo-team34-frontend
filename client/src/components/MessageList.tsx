import React from 'react';
import { format } from 'date-fns';

interface Message {
  sender: { id: string };
  message: string;
  timestamp: number | null;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, messagesEndRef }) => {
  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender.id === currentUserId ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <p>{msg.message}</p>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
