"use client";

import { useState, useRef, useEffect } from "react";
import { useCoBrowsing } from "@/hooks/useCoBrowsing";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I can browse this site with you. Ask me to 'scroll down' or 'find the projects'." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Import our "Hands"
  const { scrollPage, highlightElement, navigateTo, fillInput } = useCoBrowsing();

  // Auto-scroll to bottom of chat
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
      // 1. Scrape Context (The "Eyes")
      // We limit to 4000 chars to avoid token limits, but enough for most pages.
      const pageContext = document.body.innerText.substring(0, 4000);

      // 2. Call the Brain
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          pageContext: pageContext, // Sending what the user sees
          history: messages.map(m => ({ 
              role: m.role === 'user' ? 'user' : 'model', 
              parts: [{ text: m.content }] 
          }))
        }),
      });

      const data = await response.json();

      // 3. The Decision Logic (Talking vs. Acting)
      
      // Scenario A: It's just a conversational response
      if (data.type === "response" || !data.type) {
         setMessages((prev) => [...prev, { role: "assistant", content: data.message || "I'm not sure, could you rephrase?" }]);
      } 
      
      // Scenario B: It's an Action (Tool Call)
      else if (data.type === "action") {
        let actionResult = "Action executed.";

        // EXECUTE THE TOOL
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
            default:
                actionResult = "Unknown action requested.";
        }

        // Add a "System" message to show the action happened visually
        setMessages((prev) => [
            ...prev, 
            { role: "system", content: `⚙️ ${actionResult}` }, // Feedback logic
            { role: "assistant", content: data.message || "Done!" }
        ]);
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 1. The Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-125 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : msg.role === "system"
                      ? "bg-gray-200 text-gray-600 text-xs italic text-center w-full"
                      : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg rounded-bl-none shadow-sm text-gray-500 text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me to scroll or highlight..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. The Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && <span className="font-semibold pr-2">Chat with Portfolio</span>}
      </button>
    </div>
  );
}