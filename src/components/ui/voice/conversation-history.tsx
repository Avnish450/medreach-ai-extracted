"use client";
import { motion } from "framer-motion";
import { Message } from "@/lib/store/voice-store";

export function ConversationHistory({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg ${
            msg.role === "user"
              ? "bg-teal-500/10 border border-teal-500/20 ml-4"
              : "bg-slate-800/50 border border-slate-700 mr-4"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{msg.role === "user" ? "👤" : "🤖"}</span>
            <span className="text-xs text-slate-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm">{msg.content}</p>
        </motion.div>
      ))}
    </div>
  );
}
