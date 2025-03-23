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
interface Farmer {
  id: string;
  name: string;
  products: string[];
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

const UserChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize socket connection
  useEffect(() => {
    // In a real app, you would get the user ID from authentication
    const userInfo = localStorage.getItem("userInfo");
    const storedUserId = userInfo ? JSON.parse(userInfo).userId || "" : "";

    if (!storedUserId) {
      // Redirect to login if no user ID
      router.push("/login");
      return;
    }

    setUserId(storedUserId);

    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("joinPersonalRoom", {
        userId: userId,
        userType: "user",
      });

      console.log(`user joining personal room with ID: ${userId}`);
    }
  }, [socket, userId]);

  // Join personal room when socket and userId are available
  useEffect(() => {
    if (socket && userId) {
      socket.emit("joinPersonalRoom", { userId, userType: "user" });

      // Listen for incoming messages
      socket.on("receiveDirectMessage", (newMessage: Message) => {
        if (
          (newMessage.senderId === selectedFarmer?.id &&
            newMessage.receiverId === userId) ||
          (newMessage.senderId === userId &&
            newMessage.receiverId === selectedFarmer?.id)
        ) {
          // Add message to current conversation
          setMessages((prev) => [
            ...prev,
            {
              ...newMessage,
              message: newMessage.content || newMessage.message,
            },
          ]);

          // Mark message as read if it's from the selected farmer
          if (newMessage.senderId === selectedFarmer?.id) {
            socket.emit("markMessageAsRead", {
              messageId: newMessage.id,
              userId,
            });
          }
        }

        // Update farmer list with new message
        const updateFarmerWithNewMessage = (newMessage: Message) => {
          if (!newMessage) return; // Ensure newMessage is defined

          const messageContent = newMessage.content || newMessage.message;

          // For messages from farmers, identify the relevant farmer ID
          const relevantFarmerId =
            newMessage.senderType === "farmer"
              ? newMessage.senderId
              : newMessage.receiverId;

          // Check if this farmer is already in our list
          const farmerExists = farmers.some(
            (farmer) => farmer.id === relevantFarmerId
          );

          if (farmerExists) {
            // Update existing farmer
            setFarmers((prevFarmers) => {
              return prevFarmers.map((farmer) => {
                if (farmer.id === relevantFarmerId) {
                  return {
                    ...farmer,
                    lastMessage: messageContent,
                    lastMessageTime: newMessage.timestamp,
                    unreadCount:
                      newMessage.senderType === "farmer" &&
                      newMessage.senderId === farmer.id
                        ? (farmer.unreadCount || 0) + 1
                        : farmer.unreadCount,
                  };
                }
                return farmer;
              });
            });

            // Also update filtered farmers
            setFilteredFarmers((prevFarmers) => {
              return prevFarmers.map((farmer) => {
                if (farmer.id === relevantFarmerId) {
                  return {
                    ...farmer,
                    lastMessage: messageContent,
                    lastMessageTime: newMessage.timestamp,
                    unreadCount:
                      newMessage.senderType === "farmer" &&
                      newMessage.senderId === farmer.id
                        ? (farmer.unreadCount || 0) + 1
                        : farmer.unreadCount,
                  };
                }
                return farmer;
              });
            });
          } else if (newMessage.senderType === "farmer") {
            // Add new farmer to the list if it's a message from a farmer
            // You'll need to fetch farmer details or use the information from the message
            const newFarmer = {
              id: newMessage.senderId,
              name: newMessage.sender,
              products: [], // You might need to fetch this information separately
              lastMessage: messageContent,
              lastMessageTime: newMessage.timestamp,
              unreadCount: 1,
            };

            setFarmers((prev) => [newFarmer, ...prev]);
            setFilteredFarmers((prev) => [newFarmer, ...prev]);

            console.log("Added new farmer to list:", newFarmer);
          }
        };
      });

      // Listen for message sent confirmation
      socket.on("messageSent", (sentMessage: Message) => {
        // Update UI to show message was sent successfully
        console.log("Message sent successfully:", sentMessage);
      });

      // Listen for message errors
      socket.on("messageError", (error: any) => {
        console.error("Message error:", error);
        // Show error to user
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
          if (selectedFarmer && userId === selectedFarmer.id) {
            setIsTyping(isTyping);
          }
        }
      );

      return () => {
        socket.on("receiveDirectMessage", (newMessage: Message) => {
          console.log("User received message:", newMessage);

          // Rest of your code...
        });
        socket.off("messageSent");
        socket.off("messageError");
        socket.off("messageRead");
        socket.off("userTypingStatus");
      };
    }
  }, [socket, userId, selectedFarmer]);

  // Fetch farmers list
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/chat/farmers");

        if (!response.ok) {
          throw new Error("Failed to fetch farmers");
        }

        const data = await response.json();
        setFarmers(data);
        setFilteredFarmers(data);
      } catch (error) {
        console.error("Error fetching farmers:", error);
        // Show error message to user
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFarmers();

      // Also fetch existing conversations
      fetchExistingConversations();
    }
  }, [userId]);

  // Fetch existing conversations
  const fetchExistingConversations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/user/${userId}/conversations`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();

      // If there are existing conversations, update farmers list
      if (data.length > 0) {
        setFarmers((prevFarmers) => {
          const conversationMap = new Map(
            data.map((conv: any) => [conv.id, conv])
          );

          return prevFarmers.map((farmer) => {
            const conversation = conversationMap.get(farmer.id) as {
              lastMessage?: string;
              lastMessageTime?: string;
              unreadCount?: number;
            };
            if (conversation) {
              return {
                ...farmer,
                lastMessage: conversation.lastMessage,
                lastMessageTime: conversation.lastMessageTime,
                unreadCount: conversation.unreadCount,
              };
            }
            return farmer;
          });
        });

        // Also update filtered farmers
        setFilteredFarmers((prevFarmers) => {
          const conversationMap = new Map(
            data.map((conv: any) => [conv.id, conv])
          );

          return prevFarmers.map((farmer) => {
            const conversation = conversationMap.get(farmer.id);
            if (conversation) {
              return {
                ...farmer,
                lastMessage: conversation.lastMessage,
                lastMessageTime: conversation.lastMessageTime,
                unreadCount: conversation.unreadCount,
              };
            }
            return farmer;
          });
        });
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Update farmer list when a new message is received
  const updateFarmerWithNewMessage = (newMessage: Message) => {
    const messageContent = newMessage.content || newMessage.message;

    setFarmers((prevFarmers) => {
      return prevFarmers.map((farmer) => {
        if (
          farmer.id ===
          (newMessage.senderType === "farmer"
            ? newMessage.senderId
            : newMessage.receiverId)
        ) {
          return {
            ...farmer,
            lastMessage: messageContent,
            lastMessageTime: newMessage.timestamp,
            unreadCount:
              newMessage.senderType === "farmer" &&
              newMessage.senderId === farmer.id
                ? (farmer.unreadCount || 0) + 1
                : farmer.unreadCount,
          };
        }
        return farmer;
      });
    });

    // Also update filtered farmers
    setFilteredFarmers((prevFarmers) => {
      return prevFarmers.map((farmer) => {
        if (
          farmer.id ===
          (newMessage.senderType === "farmer"
            ? newMessage.senderId
            : newMessage.receiverId)
        ) {
          return {
            ...farmer,
            lastMessage: messageContent,
            lastMessageTime: newMessage.timestamp,
            unreadCount:
              newMessage.senderType === "farmer" &&
              newMessage.senderId === farmer.id
                ? (farmer.unreadCount || 0) + 1
                : farmer.unreadCount,
          };
        }
        return farmer;
      });
    });
  };

  // Filter farmers based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFarmers(farmers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFarmers(
        farmers.filter(
          (farmer) =>
            farmer.name.toLowerCase().includes(query) ||
            farmer.products.some((product) =>
              product.toLowerCase().includes(query)
            )
        )
      );
    }
  }, [searchQuery, farmers]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select farmer and load chat history
  const selectFarmer = async (farmer: Farmer) => {
    setSelectedFarmer(farmer);

    // Load previous messages with this farmer
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/chat/messages?userId=${userId}&farmerId=${farmer.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(
        data.map((msg: any) => ({
          ...msg,
          message: msg.content || msg.message,
        }))
      );

      // Mark messages as read
      if (
        socket &&
        data.some((msg: any) => msg.senderId === farmer.id && !msg.isRead)
      ) {
        socket.emit("markAllMessagesAsRead", {
          senderId: farmer.id,
          receiverId: userId,
        });

        // Update unread count in farmer list
        setFarmers((prevFarmers) =>
          prevFarmers.map((f) =>
            f.id === farmer.id ? { ...f, unreadCount: 0 } : f
          )
        );

        setFilteredFarmers((prevFarmers) =>
          prevFarmers.map((f) =>
            f.id === farmer.id ? { ...f, unreadCount: 0 } : f
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
    if (!socket || !selectedFarmer || message.trim() === "") return;

    const messageData = {
      senderId: userId,
      receiverId: selectedFarmer.id,
      content: message.trim(),
      senderType: "user",
    };

    // Emit message to server
    socket.emit("sendDirectMessage", messageData);

    // Optimistically add message to UI
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`, // Temporary ID until server confirms
        senderId: userId,
        receiverId: selectedFarmer.id,
        sender: "You",
        receiver: selectedFarmer.name,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
        senderType: "user",
      },
    ]);

    // Update farmer list with new message
    setFarmers((prevFarmers) =>
      prevFarmers.map((farmer) =>
        farmer.id === selectedFarmer.id
          ? {
              ...farmer,
              lastMessage: message.trim(),
              lastMessageTime: new Date().toISOString(),
            }
          : farmer
      )
    );

    setFilteredFarmers((prevFarmers) =>
      prevFarmers.map((farmer) =>
        farmer.id === selectedFarmer.id
          ? {
              ...farmer,
              lastMessage: message.trim(),
              lastMessageTime: new Date().toISOString(),
            }
          : farmer
      )
    );

    // Clear input
    setMessage("");
  };

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (socket && selectedFarmer) {
      socket.emit("userTyping", {
        senderId: userId,
        receiverId: selectedFarmer.id,
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

  // Back to farmer list (mobile view)
  const backToList = () => {
    setSelectedFarmer(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Farmers List */}
      <div
        className={`w-full md:w-1/3 bg-white border-r ${
          selectedFarmer ? "hidden md:block" : "block"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search farmers..."
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
          ) : filteredFarmers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No farmers found
            </div>
          ) : (
            filteredFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedFarmer?.id === farmer.id ? "bg-blue-50" : ""
                }`}
                onClick={() => selectFarmer(farmer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      {farmer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{farmer.name}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-[150px]">
                        {farmer.products.join(", ")}
                      </p>
                    </div>
                  </div>
                  {farmer.unreadCount ? (
                    <div className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {farmer.unreadCount}
                    </div>
                  ) : null}
                </div>
                {farmer.lastMessage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate">
                      {farmer.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400">
                      {farmer.lastMessageTime
                        ? formatTime(farmer.lastMessageTime)
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
          selectedFarmer ? "block" : "hidden md:flex"
        }`}
      >
        {selectedFarmer ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center">
              <button
                className="md:hidden mr-2 text-gray-600"
                onClick={backToList}
              >
                <FiChevronLeft size={24} />
              </button>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                {selectedFarmer.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{selectedFarmer.name}</h3>
                <p className="text-sm text-gray-500">
                  {isTyping ? (
                    <span className="text-green-500">Typing...</span>
                  ) : (
                    selectedFarmer.products.join(", ")
                  )}
                </p>
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
                    Start the conversation with {selectedFarmer.name}
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isUser = msg.senderId === userId;
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
                            isUser ? "justify-end" : "justify-start"
                          } mb-2`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              isUser
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p>{msg.message}</p>
                            <div className="flex items-center justify-end mt-1">
                              <span className="text-xs opacity-70">
                                {formatTime(msg.timestamp)}
                              </span>
                              {isUser && (
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
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
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
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-center max-w-md">
              Select a farmer from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChat;
