"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiMessageSquare,
  FiSend,
  FiSearch,
  FiChevronLeft,
} from "react-icons/fi";
import io, { Socket } from "socket.io-client";

// Types
interface User {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  sender: string;
  receiver: string;
  message: string;
  content?: string; // For compatibility with API
  timestamp: string;
  isRead: boolean;
  senderType: string;
}

const FarmerChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [farmerId, setFarmerId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize socket connection
  useEffect(() => {
    // Get farmer ID from localStorage
    const farmerInfo = localStorage.getItem("farmerInfo");
    const storedFarmerId = farmerInfo
      ? JSON.parse(farmerInfo).farmerId || ""
      : "";

    if (!storedFarmerId) {
      // Redirect to login if no farmer ID
      router.push("/farmer/login");
      return;
    }

    setFarmerId(storedFarmerId);

    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  // Join personal room when socket and farmerId are available
  useEffect(() => {
    if (socket && farmerId) {
      socket.emit("joinPersonalRoom", {
        userId: farmerId,
        userType: "farmer",
      });

      console.log(`Farmer joining personal room with ID: ${farmerId}`);
    }
  }, [socket, farmerId]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket && farmerId) {
      // Listen for incoming messages
      socket.on("receiveDirectMessage", (newMessage: Message) => {
        console.log("Received direct message:", newMessage);

        if (
          (newMessage.senderId === selectedUser?.id &&
            newMessage.receiverId === farmerId) ||
          (newMessage.senderId === farmerId &&
            newMessage.receiverId === selectedUser?.id)
        ) {
          // Add message to current conversation
          setMessages((prev) => [
            ...prev,
            {
              ...newMessage,
              message: newMessage.content || newMessage.message,
            },
          ]);

          // Mark message as read if it's from the selected user
          if (newMessage.senderId === selectedUser?.id) {
            socket.emit("markMessageAsRead", {
              messageId: newMessage.id,
              userId: farmerId,
            });
          }
        }

        // Update user list with new message
        updateUserWithNewMessage(newMessage);
      });

      // Listen for message sent confirmation
      socket.on("messageSent", (sentMessage: Message) => {
        console.log("Message sent successfully:", sentMessage);
      });

      // Listen for message errors
      socket.on("messageError", (errorData: any) => {
        console.log("Message error received:", errorData);

        // Display error to user (you could set this to state)
        const errorMessage = errorData?.error || "Failed to send message";
        console.error("Message error:", errorMessage);

        // If the message was added optimistically, remove it
        if (errorData?.originalMessage) {
          const { senderId, receiverId, content } = errorData.originalMessage;

          setMessages((prev) =>
            prev.filter(
              (msg) =>
                !(
                  msg.id.startsWith("temp-") &&
                  msg.senderId === senderId &&
                  msg.receiverId === receiverId &&
                  msg.message === content
                )
            )
          );
        }
      });

      // Listen for read receipts
      socket.on("messageRead", ({ messageId }: { messageId: string }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      });

      // Listen for typing indicators
      socket.on(
        "userTypingStatus",
        ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
          if (selectedUser && userId === selectedUser.id) {
            setIsTyping(isTyping);
          }
        }
      );

      // Connection status monitoring
      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        socket.off("receiveDirectMessage");
        socket.off("messageSent");
        socket.off("messageError");
        socket.off("messageRead");
        socket.off("userTypingStatus");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
      };
    }
  }, [socket, farmerId, selectedUser]);

  // Fetch users who have messaged this farmer
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/chat/farmer/${farmerId}/conversations`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        // Show error message to user
      } finally {
        setIsLoading(false);
      }
    };

    if (farmerId) {
      fetchUsers();
    }
  }, [farmerId]);

  // Update user list when a new message is received
  const updateUserWithNewMessage = (newMessage: Message) => {
    if (!newMessage) return; // Ensure newMessage is defined

    const messageContent = newMessage.content || newMessage.message;
    const relevantUserId =
      newMessage.senderType === "user"
        ? newMessage.senderId
        : newMessage.receiverId;

    // Check if this user is already in our list
    const userExists = users.some((user) => user.id === relevantUserId);

    if (userExists) {
      // Update existing user
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id === relevantUserId) {
            return {
              ...user,
              lastMessage: messageContent,
              lastMessageTime: newMessage.timestamp,
              unreadCount:
                newMessage.senderType === "user" &&
                newMessage.senderId === user.id
                  ? (user.unreadCount || 0) + 1
                  : user.unreadCount,
            };
          }
          return user;
        });
      });

      // Also update filtered users
      setFilteredUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id === relevantUserId) {
            return {
              ...user,
              lastMessage: messageContent,
              lastMessageTime: newMessage.timestamp,
              unreadCount:
                newMessage.senderType === "user" &&
                newMessage.senderId === user.id
                  ? (user.unreadCount || 0) + 1
                  : user.unreadCount,
            };
          }
          return user;
        });
      });
    } else if (newMessage.senderType === "user") {
      // Add new user to the list
      const newUser = {
        id: newMessage.senderId,
        name: newMessage.sender,
        lastMessage: messageContent,
        lastMessageTime: newMessage.timestamp,
        unreadCount: 1,
      };

      console.log("Adding new user to list:", newUser);
      setUsers((prev) => [newUser, ...prev]);
      setFilteredUsers((prev) => [newUser, ...prev]);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter((user) => user.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, users]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select user and load chat history
  const selectUser = async (user: User) => {
    setSelectedUser(user);

    // Load previous messages with this user
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/chat/messages?userId=${user.id}&farmerId=${farmerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      console.log("Fetched messages:", data);

      setMessages(
        data.map((msg: any) => ({
          ...msg,
          message: msg.content || msg.message,
        }))
      );

      // Mark messages as read
      if (
        socket &&
        data.some((msg: any) => msg.senderId === user.id && !msg.isRead)
      ) {
        socket.emit("markAllMessagesAsRead", {
          senderId: user.id,
          receiverId: farmerId,
        });

        // Update unread count in user list
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, unreadCount: 0 } : u
          )
        );

        setFilteredUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, unreadCount: 0 } : u
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!socket || !selectedUser || message.trim() === "") return;

    const messageData = {
      senderId: farmerId,
      receiverId: selectedUser.id,
      content: message.trim(),
      senderType: "farmer",
    };

    console.log("Sending message:", messageData);

    // Emit message to server
    socket.emit("sendDirectMessage", messageData);

    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`, // Temporary ID until server confirms
      senderId: farmerId,
      receiverId: selectedUser.id,
      sender: "You",
      receiver: selectedUser.name,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      senderType: "farmer",
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Update user list with new message
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              lastMessage: message.trim(),
              lastMessageTime: new Date().toISOString(),
            }
          : user
      )
    );

    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              lastMessage: message.trim(),
              lastMessageTime: new Date().toISOString(),
            }
          : user
      )
    );

    // Clear input
    setMessage("");
  };

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (socket && selectedUser) {
      socket.emit("userTyping", {
        senderId: farmerId,
        receiverId: selectedUser.id,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for message groups
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Back to user list (mobile view)
  const backToList = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users List */}
      <div
        className={`w-full md:w-1/3 bg-white border-r ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Customer Messages</h2>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full p-2 pl-8 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No messages yet</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.id === user.id ? "bg-blue-50" : ""
                }`}
                onClick={() => selectUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{user.name}</h3>
                    </div>
                  </div>
                  {user.unreadCount ? (
                    <div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user.unreadCount}
                    </div>
                  ) : null}
                </div>
                {user.lastMessage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate">
                      {user.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.lastMessageTime
                        ? formatTime(user.lastMessageTime)
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`w-full md:w-2/3 flex flex-col ${
          selectedUser ? "block" : "hidden md:flex"
        }`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center">
              <button
                className="md:hidden mr-2 text-gray-600"
                onClick={backToList}
              >
                <FiChevronLeft size={24} />
              </button>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{selectedUser.name}</h3>
                {isTyping && (
                  <p className="text-sm text-green-500">Typing...</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FiMessageSquare size={48} className="mb-2" />
                  <p>No messages yet</p>
                  <p className="text-sm">
                    Start the conversation with {selectedUser.name}
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isFarmer = msg.senderId === farmerId;
                    const showDate =
                      index === 0 ||
                      formatDate(messages[index - 1].timestamp) !==
                        formatDate(msg.timestamp);

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="text-center my-2">
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                              {formatDate(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            isFarmer ? "justify-end" : "justify-start"
                          } mb-2`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              isFarmer
                                ? "bg-green-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p>{msg.message}</p>
                            <div className="flex items-center justify-end mt-1">
                              <span className="text-xs opacity-70">
                                {formatTime(msg.timestamp)}
                              </span>
                              {isFarmer && (
                                <span className="ml-1">
                                  {msg.isRead ? (
                                    <span className="text-xs">✓✓</span>
                                  ) : (
                                    <span className="text-xs">✓</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="bg-green-500 text-white p-2 rounded-r-lg hover:bg-green-600"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <FiMessageSquare size={64} className="mb-4" />
            <h3 className="text-xl font-medium mb-2">Your Customer Messages</h3>
            <p className="text-center max-w-md">
              Select a customer from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerChat;
