import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

interface CurrentUser {
  id: string;
  role: string;
}

const ChatSidebar = ({ currentUser }: { currentUser: CurrentUser }) => {
  interface Conversation {
    id: string;
    name: string;
    lastMessage?: string;
    unreadCount?: number;
  }
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/conversations/${currentUser.id}?role=${currentUser.role}`
        );
        setConversations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [currentUser]);
  
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Messages</h2>
      </div>
      
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="conversation-list">
        {loading ? (
          <div className="loading-conversations">Loading...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="no-conversations">
            {searchTerm ? 'No matching conversations' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map(conv => (
            <div key={conv.id} className="conversation-item">
              <div className="conversation-avatar">
                {conv.name.charAt(0).toUpperCase()}
              </div>
              <div className="conversation-info">
                <h3>{conv.name}</h3>
                <p className="last-message">{conv.lastMessage || 'Start chatting'}</p>
              </div>
              {conv.unreadCount && conv.unreadCount > 0 && (
                <div className="unread-badge">{conv.unreadCount}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
