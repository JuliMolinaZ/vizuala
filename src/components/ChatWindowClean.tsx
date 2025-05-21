"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Image as ImageIcon, Loader2, User, Bot, FileText, Eye, Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage?: (message: string, attachment?: {
    type: 'image' | 'file' | 'audio';
    name: string;
    url: string;
    duration?: number;
  }) => void;
  isLoading?: boolean;
}

export default function ChatWindow({ messages, onSendMessage, isLoading }: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((inputMessage.trim() || audioBlob) && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      setAudioBlob(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendMessage) {
      if (file.type.startsWith('audio/')) {
        const audioUrl = URL.createObjectURL(file);
        onSendMessage(`[Adjunto audio: ${file.name}]`, {
          type: 'audio',
          name: file.name,
          url: audioUrl,
        });
      } else if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onSendMessage(`[Adjunto imagen: ${file.name}]`, {
          type: 'image',
          name: file.name,
          url: imageUrl,
        });
      } else {
        onSendMessage(`[Adjunto archivo: ${file.name}]`, {
          type: 'file',
          name: file.name,
          url: URL.createObjectURL(file),
        });
      }
    }
    setIsAttaching(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        if (onSendMessage) {
          onSendMessage('[Mensaje de voz]', {
            type: 'audio',
            name: 'audio.webm',
            url: audioUrl,
            duration: recordingTime,
          });
        }
        setRecordingTime(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const toggleAudioPlayback = (audioId: string, url: string) => {
    if (!audioRefs.current[audioId]) {
      audioRefs.current[audioId] = new Audio(url);
      audioRefs.current[audioId].onended = () => {
        setIsPlaying(null);
      };
    }

    if (isPlaying === audioId) {
      audioRefs.current[audioId].pause();
      setIsPlaying(null);
    } else {
      // Detener cualquier audio que esté reproduciéndose
      Object.keys(audioRefs.current).forEach(id => {
        if (id !== audioId) {
          audioRefs.current[id].pause();
          audioRefs.current[id].currentTime = 0;
        }
      });
      audioRefs.current[audioId].play();
      setIsPlaying(audioId);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 p-4">
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 pr-2">
        <AnimatePresence initial={false} mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                'flex items-end gap-3 max-w-[85%]',
                message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-md bg-gray-800 ring-2 ring-purple-500 ring-opacity-50">
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-purple-300" />
                )}
              </div>
              <div
                className={cn(
                  'relative px-4 py-2 rounded-xl text-base shadow-lg transition-all duration-300',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-br-lg rounded-tl-lg rounded-bl-lg'
                    : 'bg-gray-700 text-gray-100 rounded-bl-lg rounded-tr-lg rounded-br-lg'
                )}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, i) => (
                      <div key={i} className="flex flex-col gap-2 p-3 bg-gray-800/50 rounded-lg shadow-inner">
                        {attachment.type === 'image' && attachment.url ? (
                          <div className="relative w-48 h-48 overflow-hidden rounded-md cursor-pointer">
                            <img
                              src={attachment.url}
                              alt={attachment.name || 'Imagen adjunta'}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Eye className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        ) : attachment.type === 'audio' ? (
                          <div className="flex items-center gap-3 bg-gray-900/50 p-2 rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-full bg-purple-500/20 hover:bg-purple-500/30"
                              onClick={() => toggleAudioPlayback(message.id + i, attachment.url)}
                            >
                              {isPlaying === message.id + i ? (
                                <Pause className="w-4 h-4 text-purple-300" />
                              ) : (
                                <Play className="w-4 h-4 text-purple-300" />
                              )}
                            </Button>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-purple-200">{attachment.name}</span>
                              {attachment.duration && (
                                <span className="text-xs text-purple-300/70">{formatTime(attachment.duration)}</span>
                              )}
                            </div>
                          </div>
                        ) : attachment.type === 'file' ? (
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-pink-300" />
                            <span className="text-sm font-semibold text-gray-200 truncate">{attachment.name}</span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
                <span className={cn(
                  'block mt-1 text-[10px] opacity-70',
                  message.role === 'user' ? 'text-right text-purple-100' : 'text-left text-gray-300'
                )}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-3 flex-shrink-0 mt-auto">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "text-gray-400 hover:text-purple-400 transition-colors",
              isRecording && "text-red-400 hover:text-red-300 animate-pulse"
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isRecording}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "text-gray-400 hover:text-purple-400 transition-colors",
              isRecording && "text-red-400 hover:text-red-300"
            )}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            {isRecording ? (
              <>
                <Square className="h-5 w-5" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-400">
                  {formatTime(recordingTime)}
                </span>
              </>
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
        </div>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isLoading ? "Enviando..." : isRecording ? "Grabando..." : "Escribe un mensaje..."}
          className="flex-1 bg-gray-700 text-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 disabled:opacity-50"
          disabled={isLoading || isRecording}
        />

        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
          disabled={(!inputMessage.trim() && !isRecording) || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,audio/*"
        />
      </form>
    </div>
  );
}
