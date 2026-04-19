"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

interface Message {
  id: string;
  message: string;
  userId: string;
  user: {
    name: string;
    profile?: {
      profileImage: string;
    };
  };
  createdAt: string;
}

import { getSocket } from "@/lib/socket";
import { ChatServices } from "@/services/chat.service";

export const ChatBox = ({ eventId }: { eventId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const data = await ChatServices.getEventMessages(eventId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();

    // Socket.io integration
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.emit("join-chat", eventId);

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave-chat", eventId);
      socket.off("new-message");
    };
  }, [eventId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await ChatServices.sendMessage(eventId, newMessage);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-sm">Event Group Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-2">
            <MessageCircle className="w-8 h-8 opacity-20" />
            <p className="text-xs">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.userId === user?.id ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {msg.user.profile?.profileImage ? (
                  <img src={msg.user.profile.profileImage} alt={msg.user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div className={`flex flex-col ${msg.userId === user?.id ? "items-end" : ""}`}>
                <span className="text-[10px] font-bold text-zinc-500 mb-1">{msg.user.name}</span>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.userId === user?.id
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[8px] text-zinc-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
