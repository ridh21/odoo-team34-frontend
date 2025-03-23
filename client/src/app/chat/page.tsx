"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Chat = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    const farmerId = localStorage.getItem("farmerId");
    
    if (userId) {
      // Redirect to user chat
      router.push("/user/chat");
    } else if (farmerId) {
      // Redirect to farmer chat
      router.push("/farmer/chat");
    } else {
      // Not logged in, redirect to login
      router.push("/login");
    }
    
    setLoading(false);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Redirecting to chat...</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
