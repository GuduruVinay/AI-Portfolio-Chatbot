"use client";

import { useState, useRef, useEffect } from "react";
import { useCoBrowsing } from "@/hooks/useCoBrowsing";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm your AI co-pilot. I can **scroll**, **highlight**, or **fill forms** for you." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { scrollPage, highlightElement, navigateTo, fillInput } = useCoBrowsing();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // 1. Grab context
      const pageContext = document.body.innerText.substring(0, 4000);
      
      // 2. Format history for Gemini (strip system logs and start with user)
      const apiHistory = messages.slice(1).filter(m => m.role !== "system").map(m => ({ 
            role: m.role === 'user' ? 'user' : 'model', 
            parts: [{ text: m.content }] 
      }));

      // 3. Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, pageContext, history: apiHistory }),
      });

      const data = await response.json();

      // 4. Handle tool call vs normal response
      if (data.type === "action") {
        let actionResult = "Action executed.";
        switch (data.tool) {
            case "scroll": actionResult = scrollPage(data.args.direction); break;
            case "highlight": actionResult = highlightElement(data.args.text || data.args.keyword); break;
            case "navigate": actionResult = navigateTo(data.args.path); break;
            case "fill_form": actionResult = fillInput(data.args.field, data.args.value); break;
        }
        setMessages((prev) => [
            ...prev, 
            { role: "system", content: `⚙️ ${actionResult}` }, 
            { role: "assistant", content: data.message || "Done!" }
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error connecting to the AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* CHAT WINDOW */}
      <div className={`
        transition-all duration-300 ease-in-out transform origin-bottom-right
        ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-10 pointer-events-none"}
        mb-4 w-87.5 md:w-100 h-137.5
        bg-white dark:bg-slate-900 
        rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 
        overflow-hidden flex flex-col
      `}>
        
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Bot className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-sm">Portfolio Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Co-browsing active
                </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50 dark:bg-slate-950/50 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              
              {msg.role !== "user" && msg.role !== "system" && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}

              <div className={`max-w-[80%] px-4 py-3 shadow-sm text-sm leading-relaxed
                ${msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                  : msg.role === "system"
                  ? "bg-transparent text-slate-400 dark:text-slate-500 text-xs italic w-full text-center py-1 shadow-none"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm"
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex justify-start ml-10">
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me to scroll or highlight..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-center text-slate-400 mt-2 flex justify-center items-center gap-1">
            <Sparkles className="w-3 h-3" /> Powered by Gemini API
          </div>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 p-4 bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-110 active:scale-95 flex items-center justify-center`}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}