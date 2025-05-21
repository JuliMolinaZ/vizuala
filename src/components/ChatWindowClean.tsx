"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, Bot, FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'system';
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
}

function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Mensajes + Línea divisoria */}
      <div className="relative flex-1 overflow-y-auto px-2 py-4 sm:px-6 sm:py-8 space-y-4 bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 rounded-2xl shadow-inner scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">


        {messages.map(msg => {
          const isFile = msg.content.startsWith('Adjunto archivo:') || msg.content.startsWith('Adjunto imagen:');
          const fileName = isFile ? msg.content.split(': ')[1] : null;
          const isImage = msg.content.startsWith('Adjunto imagen:');
          const isPDF = msg.content.startsWith('Adjunto archivo:') && fileName?.endsWith('.pdf');
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 sm:gap-4 ${isUser ? 'justify-end flex-row-reverse' : 'justify-start'}`}
              style={{ marginBottom: 8 }}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 z-10">
                {isUser ? (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center shadow-md border border-purple-700">
                    <Bot className="w-6 h-6 text-purple-200" />
                  </div>
                )}
              </div>
              {/* Burbuja + Etiqueta */}
              <div className="flex flex-col items-stretch min-w-0">
                {/* Etiqueta */}
                <span className={cn(
                  "text-xs font-bold mb-1 select-none",
                  isUser ? "text-pink-200 text-right pr-1" : "text-purple-300 text-left pl-1"
                )}>
                  {isUser ? "Tú" : "IA"}
                </span>
                <Card
                  className={cn(
                    "max-w-[85vw] sm:max-w-[60vw] px-4 sm:px-5 py-3 sm:py-4 min-h-[40px] flex flex-col justify-between border-0 shadow-lg relative",
                    isUser
                      ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white ml-1 sm:ml-2 rounded-br-3xl rounded-tl-2xl rounded-bl-2xl border-2 border-purple-400"
                      : "bg-gray-800 text-purple-100 mr-1 sm:mr-2 rounded-bl-3xl rounded-tr-2xl rounded-br-2xl border-2 border-gray-700"
                  )}
                >
                  {isFile && (
                    <div className="flex items-center gap-2 mb-2">
                      {isPDF && <FileText className="w-5 h-5 text-pink-300" />}
                      {isImage && <Eye className="w-5 h-5 text-purple-300" />}
                      <span className="text-xs font-semibold text-purple-200 truncate">{fileName}</span>
                    </div>
                  )}
                  <span className="whitespace-pre-line break-words text-base font-medium">
                    {msg.content}
                  </span>
                  <span className={cn(
                    "text-xs opacity-70 mt-3 block",
                    isUser ? 'text-right text-purple-100' : 'text-left text-gray-400'
                  )}>
                    {formatTime(msg.timestamp)}
                  </span>
                </Card>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Input para chatear */}
      <div className="p-5 border-t border-gray-800 bg-gradient-to-b from-gray-900 to-purple-950 rounded-b-2xl flex items-center gap-3 sticky bottom-0 z-10">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-gray-800/80 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-xl px-4 py-3 text-base shadow"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className={cn(
            "flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:ring-2 focus:ring-purple-400 text-white transition-transform rounded-full w-12 h-12 text-lg shadow-lg",
            input.trim() ? "hover:-translate-y-0.5" : "opacity-60 cursor-not-allowed"
          )}
          disabled={!input.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
