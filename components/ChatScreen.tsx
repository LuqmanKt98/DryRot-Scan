import React, { useState, useEffect, useRef } from 'react';
import type { ScanRecord, ChatMessage } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { GoogleGenAI, Chat } from "@google/genai";
import { useTranslation } from '../hooks/useTranslation';

// FORCE FIX: Tell TypeScript that process exists
declare var process: any;

interface ChatScreenProps {
  record: ScanRecord;
  initialMessages: ChatMessage[];
  onClose: () => void;
  onUpdateMessages: (messages: ChatMessage[]) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ record, initialMessages, onClose, onUpdateMessages }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize chat
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else {
      const initial: ChatMessage = {
        id: 'init',
        role: 'model',
        text: t('chat.initialMessage'),
        timestamp: new Date(),
      };
      setMessages([initial]);
      onUpdateMessages([initial]);
    }

    // Initialize Gemini
    // Use the declared process variable
    const apiKey = process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Construct context from record
    const contextData = {
      date: record.date,
      scans: record.scans.map(s => ({
        position: s.tirePosition,
        status: s.status,
        dotInfo: s.dotInfo,
        analysis: s.analysis
      }))
    };

    const systemInstruction = `You are an expert automotive mechanic specializing in tires, dry rot, and vehicle safety. 
    You are chatting with a vehicle owner who has just scanned their tires using the DryRot Scan app.
    
    Here is the JSON data representing their scan results:
    ${JSON.stringify(contextData)}
    
    Rules:
    1. Answer questions specifically based on this data.
    2. Explain technical terms (like DOT date codes) simply.
    3. If a tire has "Don't Buy" status, strongly advise replacement.
    4. Keep answers concise, helpful, and empathetic.
    5. Do not make up information not present in the data, but you can give general automotive advice if asked.
    `;

    chatSessionRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });

  }, [record]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    onUpdateMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      
      // FIX: Explicitly handle potential undefined text
      const responseText = result.text ? result.text : "";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      
      const updatedWithAi = [...newMessages, aiMsg];
      setMessages(updatedWithAi);
      onUpdateMessages(updatedWithAi);
    } catch (error) {
      console.error("Chat error:", error);
      // Handle error appropriately in UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-base-100 z-50 flex flex-col animate-fade-in">
      <header className="bg-base-200 shadow-md p-4 flex items-center gap-4">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-base-300">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold">{t('chat.title')}</h1>
          <p className="text-xs text-base-content/60">{t('chat.subtitle')}</p>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-orange text-white rounded-tr-none' 
                  : 'bg-base-300 text-base-content rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-base-300 text-base-content/60 px-4 py-2 rounded-2xl rounded-tl-none text-xs animate-pulse">
              {t('chat.typing')}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-base-200 border-t border-base-300">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-grow input input-bordered bg-base-100 focus:outline-none focus:border-brand-orange"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="px-6 bg-brand-orange text-white font-bold rounded-lg hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('chat.send')}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;