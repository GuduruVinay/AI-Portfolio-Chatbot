"use client";

import { useState, useRef, useEffect } from "react";
import { useCoBrowsing } from "@/hooks/useCoBrowsing";
import { MessageCircle, X, Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Initial State: Starts with an Assistant message (this caused the error before)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I can browse this site with you. Ask me to 'scroll down' or 'find the projects'." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Import our "Hands"
  const { scrollPage, highlightElement, navigateTo, fillInput } = useCoBrowsing();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    
    // Update local UI state immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // 1. Scrape Context (The "Eyes")
      const pageContext = document.body.innerText.substring(0, 4000);

      // 2. Prepare History for Gemini (THE FIX IS HERE)
      // Gemini history MUST start with 'user'. 
      // We filter out the first 'assistant' welcome message and any local 'system' logs.
      const apiHistory = messages
        .slice(1) // Remove the initial Welcome message
        .filter(m => m.role !== "system") // Remove "Action executed" logs
        .map(m => ({ 
            role: m.role === 'user' ? 'user' : 'model', // Gemini uses 'model', not 'assistant'
            parts: [{ text: m.content }] 
        }));

      // 3. Call the Brain
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          pageContext: pageContext,
          history: apiHistory // Send the cleaned history
        }),
      });

      const data = await response.json();

      // 4. Handle Response (Action vs Text)
      if (data.type === "action") {
        // Execute Tool
        let actionResult = "Action executed.";
        
        switch (data.tool) {
            case "scroll":
                actionResult = scrollPage(data.args.direction);
                break;
            case "highlight":
                actionResult = highlightElement(data.args.text || data.args.keyword);
                break;
            case "navigate":
                actionResult = navigateTo(data.args.path);
                break;
            case "fill_form":
                actionResult = fillInput(data.args.field, data.args.value);
                break;
        }

        // Show System Feedback + AI Response
        setMessages((prev) => [
            ...prev, 
            { role: "system", content: `⚙️ ${actionResult}` }, 
            { role: "assistant", content: data.message || "Done!" }
        ]);
      } else {
        // Standard Text Response
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-125">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Co-Browsing Agent</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm
                  ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : 
                    msg.role === "system" ? "bg-gray-200 text-gray-600 text-xs italic w-full text-center" : 
                    "bg-white border text-gray-800 rounded-bl-none"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-400 ml-4">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me to scroll or highlight..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-4 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2">
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && <span className="font-semibold pr-2">Chat</span>}
      </button>
    </div>
  );
}