"use client"
import { useEffect } from "react";

declare global {
  interface Window {
    chatbase: any;
  }
}

const ChatbaseBot = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args: any) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args: any) => target(prop, ...args);
          },
        });
      }

      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "ByzwGKuCldBXjuPRM_HbN";
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    }
  }, []);

  return null;
};

export default ChatbaseBot;