"use client";

import { useState, useRef, useEffect } from "react";
import { useCoBrowsing } from "@/hooks/useCoBrowsing";
import { MessageCircle, X, Send, Bot, Sparkles, Mic, RotateCcw, Check, Key } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant" | "system" | "interactive";
  content: string;
  pendingAction?: any;
  resolved?: boolean;
}

const INITIAL_MESSAGE: Message = { 
  role: "assistant", 
  content: "Hi there! 👋 I'm your AI co-pilot. I can **scroll**, **highlight**, or **fill forms** for you." 
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); 
  
  const [customApiKey, setCustomApiKey] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { scrollPage, highlightElement, navigateTo, fillInput } = useCoBrowsing();

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setCustomApiKey(storedKey);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openApiKeyModal = () => {
    setTempApiKey(customApiKey || "");
    setIsApiKeyModalOpen(true);
  };

  const saveApiKey = () => {
    const trimmedKey = tempApiKey.trim();
    setCustomApiKey(trimmedKey);
    
    if (trimmedKey) {
      localStorage.setItem("gemini_api_key", trimmedKey);
      setMessages(prev => [...prev, { role: "system", content: "🔑 Custom API Key saved locally." }]);
    } else {
      localStorage.removeItem("gemini_api_key");
      setMessages(prev => [...prev, { role: "system", content: "🔓 Removed custom API Key. Using default." }]);
    }
    setIsApiKeyModalOpen(false);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  const toggleListening = () => {
    if (isListening) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    };
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        alert("Microphone access was denied. Please allow it in your browser settings.");
      } else {
        console.error("Speech recognition error", event.error);
      }
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleResolveAction = (index: number, approved: boolean) => {
    const msg = messages[index];
    if (!msg.pendingAction) return;

    setMessages(prev => prev.map((m, i) => i === index ? { ...m, resolved: true } : m));

    if (approved) {
        const { tool, args } = msg.pendingAction;
        let actionResult = "";
        
        if (tool === "fill_form") {
            actionResult = fillInput(args.field, args.value);
        }

        setMessages(prev => [
            ...prev,
            { role: "system", content: `✅ Approved: ${actionResult}` }
        ]);
    } else {
        setMessages(prev => [
            ...prev,
            { role: "system", content: `❌ Action denied by user.` }
        ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const pageContext = document.body.innerText.substring(0, 4000);
      
      const apiHistory = messages
        .slice(1)
        .filter(m => m.role !== "system" && m.role !== "interactive") 
        .map(m => ({ 
            role: m.role === 'user' ? 'user' : 'model', 
            parts: [{ text: m.content }] 
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, pageContext, history: apiHistory, customApiKey }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.type === "action") {
        if (data.tool === "fill_form") {
            setMessages((prev) => [
                ...prev, 
                { role: "assistant", content: data.message || "I can help with that." },
                { 
                    role: "interactive", 
                    content: `Allow AI to input "${data.args.value}" into the "${data.args.field}" field?`,
                    pendingAction: data,
                    resolved: false
                }
            ]);
        } else {
            let actionResult = "Action executed.";
            switch (data.tool) {
                case "scroll": 
                    actionResult = scrollPage(data.args.target || data.args.direction); 
                    break;
                case "highlight": 
                    actionResult = highlightElement(data.args.text || data.args.keyword); 
                    break;
                case "navigate": 
                    actionResult = navigateTo(data.args.path); 
                    break;
            }
            setMessages((prev) => [
                ...prev, 
                { role: "system", content: `⚙️ ${actionResult}` }, 
                { role: "assistant", content: data.message || "Done!" }
            ]);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "system", content: `⚠️ Error: ${error.message || "Failed to connect to AI."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans">
      
      <div className={`
        absolute bottom-20 right-0
        transition-all duration-300 ease-in-out transform origin-bottom-right
        ${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"}
        w-87.5 md:w-100 h-137.5
        bg-white dark:bg-slate-900 
        rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 
        overflow-hidden flex flex-col relative
      `}>
        
        {isApiKeyModalOpen && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col justify-center items-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full transform transition-all animate-in zoom-in-95">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Configuration</h4>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                Enter your own Google Gemini API key to use your personal quota. Leave this blank to use the site's default key.
              </p>
              
              <input 
                type="password" 
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl mb-5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveApiKey}
                  className="flex-1 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-500/20"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        )}
        
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
          
          <div className="flex items-center gap-3">
            <button 
              onClick={openApiKeyModal} 
              className={`transition-colors ${customApiKey ? "text-yellow-300 hover:text-yellow-100" : "text-white/70 hover:text-white"}`}
              title="Set Custom API Key"
            >
              <Key className="w-4 h-4" />
            </button>
            <button onClick={handleClearChat} className="text-white/70 hover:text-white transition-colors" title="Clear Chat">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors" title="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50 dark:bg-slate-950/50 scrollbar-thin">
          {messages.map((msg, idx) => {
            
            if (msg.role === "interactive") {
                return (
                    <div key={idx} className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 text-sm border border-slate-200 dark:border-slate-700 shadow-sm animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-200 font-medium">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            Permission Required
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{msg.content}</p>
                        
                        {!msg.resolved ? (
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => handleResolveAction(idx, true)} 
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors flex justify-center items-center gap-2 font-medium"
                                >
                                  <Check className="w-4 h-4"/> Approve
                                </button>
                                <button 
                                  onClick={() => handleResolveAction(idx, false)} 
                                  className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 py-2 rounded-lg transition-colors flex justify-center items-center gap-2 font-medium"
                                >
                                  <X className="w-4 h-4"/> Deny
                                </button>
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 italic text-center">Request closed.</div>
                        )}
                    </div>
                );
            }

            return (
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
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
            );
          })}
          
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

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask me to scroll or highlight..."}
              className="w-full pl-4 pr-20 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            
            <div className="absolute right-2 flex items-center gap-1">
              <button
                onClick={toggleListening}
                title="Use Voice"
                className={`p-2 rounded-lg transition-all ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "text-slate-400 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400 mt-2 flex justify-center items-center gap-1">
            <Sparkles className="w-3 h-3" /> Powered by Gemini API
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute bottom-0 right-0
          pointer-events-auto 
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} 
          transition-all duration-300 
          w-14 h-14 bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-110 active:scale-95 flex items-center justify-center
        `}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}