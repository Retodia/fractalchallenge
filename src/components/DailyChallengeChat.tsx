import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, SparklesIcon } from './icons/Icons';
import { getChallengeAiResponse } from '../services/geminiService';

interface DailyChallengeChatProps {
  userId: string;
  initialMessage: string;
  systemInstruction: string;
}

const DailyChallengeChat: React.FC<DailyChallengeChatProps> = ({ userId, initialMessage, systemInstruction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial-ai-msg', role: 'model', text: initialMessage }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const historyToSend = [...messages, newUserMessage];
        const aiResponseText = await getChallengeAiResponse(userId, systemInstruction, historyToSend);
        const newAiMessage: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: aiResponseText };
        setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
        console.error("Error in daily challenge chat:", error);
        const errorMsg: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: "Lo siento, algo salió mal. Inténtalo de nuevo." };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-gray-800/50 border border-gray-700 rounded-xl">
      <header className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white text-center">Asistente para tu Reto</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 flex-shrink-0 bg-indigo-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && (
              <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="w-8 h-8 flex-shrink-0 bg-indigo-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            <div className="max-w-xs p-3 rounded-2xl bg-gray-700 rounded-bl-none flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="¿Necesitas ayuda con tu reto?"
            disabled={isLoading}
            className="flex-1 w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyChallengeChat;