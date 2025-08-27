import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Send, MessageCircle, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      if (messages.length === 0) {
        addBotMessage("Hello! 👋 I'm your friendly support assistant. How can I help you today?");
      }
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, [messages.length]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage(text, 'bot');
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('upload') || message.includes('how to')) {
      return "To upload an image, simply drag and drop your image onto the upload area on the dashboard, or click to browse your files. I support JPG, PNG, and GIF formats up to 10MB! 📸";
    }
    
    if (message.includes('language') || message.includes('translation')) {
      return "I generate captions in three languages: English, Telugu, and Hindi! Each caption is AI-powered and captures the essence of your image. 🌍";
    }
    
    if (message.includes('delete') || message.includes('remove')) {
      return "To delete an image and its captions, go to your History page and click the red trash icon next to any image. You'll get a confirmation dialog before deletion. 🗑️";
    }
    
    if (message.includes('download') || message.includes('save')) {
      return "You can download your captions as a text file by clicking the download icon next to any image in your history. The file will include all three language versions! 💾";
    }
    
    if (message.includes('error') || message.includes('problem') || message.includes('not working')) {
      return "I'm sorry you're experiencing issues! Try refreshing the page first. If the problem persists, please contact our support team at 8688195228 or ganumulapally@gmail.com. 🛠️";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need help. Feel free to ask me anything about MultiLang Caption! 😊";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello there! 👋 I'm here to help you with any questions about MultiLang Caption. What would you like to know?";
    }
    
    if (message.includes('contact') || message.includes('support') || message.includes('help')) {
      return "You can reach our support team in several ways:\n📞 Call: 8688195228\n📧 Email: ganumulapally@gmail.com\nOr just chat with me here for quick help! 💬";
    }
    
    if (message.includes('account') || message.includes('login') || message.includes('signin')) {
      return "We use secure Replit authentication for your account. If you're having login issues, make sure you're using the correct Replit credentials or try clearing your browser cache. 🔐";
    }
    
    // Default response
    return "I'd be happy to help! I can assist with uploading images, using different languages, downloading captions, or any other questions about MultiLang Caption. For complex issues, please contact our support team at 8688195228. What specifically would you like to know? 🤔";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    const response = getBotResponse(inputValue);
    addBotMessage(response);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 z-50"
        data-testid="button-open-chatbot"
      >
        <MessageCircle size={24} className="text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] glass border-2 border-white/20 shadow-2xl z-50 flex flex-col">
      <CardHeader className="border-b border-white/20 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Support Assistant
              </h3>
              <p className="text-xs text-muted-foreground">Here to help you!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/10"
            data-testid="button-close-chatbot"
          >
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  {message.sender === 'user' ? 
                    <User className="text-white" size={14} /> : 
                    <Bot className="text-white" size={14} />
                  }
                </div>
                <div className={`glass rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20' 
                    : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={14} />
                </div>
                <div className="glass rounded-lg p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="glass border-white/20 focus:border-blue-500"
            data-testid="input-chatbot-message"
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            data-testid="button-send-message"
          >
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}