import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Brain,
  Heart
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isCeoMode: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
}

// Animated Mascot Component
const AnimatedMascot = ({ isCeoMode, isTyping }: { isCeoMode: boolean; isTyping: boolean }) => {
  return (
    <div className="relative w-16 h-16 mx-auto mb-4">
      <motion.div
        animate={{
          scale: isTyping ? [1, 1.1, 1] : 1,
          rotate: isTyping ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: isTyping ? 0.8 : 2,
          repeat: isTyping ? Infinity : 0,
          ease: "easeInOut"
        }}
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isCeoMode 
            ? 'bg-gradient-to-br from-primary to-primary-glow' 
            : 'bg-gradient-to-br from-pink-400 to-purple-400'
        }`}
      >
        {isCeoMode ? (
          <Brain className="h-8 w-8 text-white" />
        ) : (
          <Heart className="h-8 w-8 text-white" />
        )}
      </motion.div>
      
      {/* Eyes */}
      <motion.div 
        className="absolute top-3 left-4 w-2 h-2 bg-white rounded-full"
        animate={{ scaleY: isTyping ? [1, 0.1, 1] : 1 }}
        transition={{ duration: 0.3, repeat: isTyping ? Infinity : 0 }}
      />
      <motion.div 
        className="absolute top-3 right-4 w-2 h-2 bg-white rounded-full"
        animate={{ scaleY: isTyping ? [1, 0.1, 1] : 1 }}
        transition={{ duration: 0.3, repeat: isTyping ? Infinity : 0, delay: 0.1 }}
      />
      
      {/* Mouth */}
      <motion.div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-white rounded-full"
        animate={{ 
          scaleX: isTyping ? [1, 0.5, 1] : 1,
          scaleY: isTyping ? [1, 1.5, 1] : 1
        }}
        transition={{ duration: 0.4, repeat: isTyping ? Infinity : 0 }}
      />
    </div>
  );
};

const ChatBot = ({ isCeoMode, isMinimized, onToggleMinimize, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: isCeoMode 
        ? "Elite AI Assistant activated. I'm here to optimize your productivity and enforce mission discipline. What requires immediate attention?"
        : "Hi there! 👋 I'm your friendly productivity companion. How can I help you stay organized and motivated today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI responses based on mode
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (isCeoMode) {
      // CEO Mode responses - firm and professional
      if (message.includes('help') || message.includes('stuck')) {
        return "PERFORMANCE ANALYSIS: Identify the core obstacle. Break it into micro-objectives. Execute systematically. Failure is not acceptable.";
      }
      if (message.includes('task') || message.includes('work')) {
        return "Mission parameters received. Prioritize by impact and urgency. Deploy maximum focus protocols. Time is your most valuable asset.";
      }
      if (message.includes('tired') || message.includes('break')) {
        return "Elite performers push through resistance. This is where champions are forged. Recalibrate, hydrate, and re-engage. Excellence demands sacrifice.";
      }
      if (message.includes('motivation') || message.includes('inspire')) {
        return "You chose the elite path. Your competition is watching Netflix while you build empires. Greatness is earned through relentless execution.";
      }
      return "Understood. Maintain operational focus. Execute with precision. Report status upon mission completion.";
    } else {
      // Casual Mode responses - friendly and supportive
      if (message.includes('help') || message.includes('stuck')) {
        return "I'm here to help! 😊 Let's break this down together. What specific part is challenging you? We can figure this out step by step.";
      }
      if (message.includes('task') || message.includes('work')) {
        return "Great! Let's make your tasks more manageable. I can help you organize them by priority or break big tasks into smaller, easier chunks. What works best for you?";
      }
      if (message.includes('tired') || message.includes('break')) {
        return "It sounds like you need a well-deserved break! 🌸 Remember, rest is productive too. Maybe take a short walk or grab some tea? You've got this!";
      }
      if (message.includes('motivation') || message.includes('inspire')) {
        return "You're doing amazing! 🌟 Every small step counts, and I believe in you. Progress isn't always fast, but it's always worth it. Keep going!";
      }
      return "Thanks for sharing! I'm here whenever you need support or just want to chat. You're doing great! 💪";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className={`w-14 h-14 rounded-full shadow-lg ${
            isCeoMode 
              ? 'bg-gradient-to-r from-primary to-primary-glow hover:shadow-elite' 
              : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:shadow-lg'
          }`}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] z-50"
    >
      <Card className="h-full flex flex-col shadow-2xl border-2">
        <CardHeader className={`pb-3 ${
          isCeoMode 
            ? 'bg-gradient-to-r from-card to-primary/10' 
            : 'bg-gradient-to-r from-card to-pink-50 dark:to-pink-900/20'
        }`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {isCeoMode ? (
                <Brain className="h-5 w-5 text-primary" />
              ) : (
                <Heart className="h-5 w-5 text-pink-400" />
              )}
              <span>
                {isCeoMode ? 'Elite AI Assistant' : 'Friendly Assistant'}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Animated Mascot */}
          <AnimatedMascot isCeoMode={isCeoMode} isTyping={isTyping} />
          
          <Badge 
            variant="outline" 
            className={`text-xs text-center ${
              isCeoMode ? 'border-primary' : 'border-pink-400'
            }`}
          >
            {isCeoMode ? 'MILITARY-GRADE AI' : 'FRIENDLY COMPANION'}
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : isCeoMode
                        ? 'bg-muted'
                        : 'bg-pink-50 dark:bg-pink-900/20'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        isCeoMode ? (
                          <Bot className="h-4 w-4 mt-0.5 text-primary" />
                        ) : (
                          <Heart className="h-4 w-4 mt-0.5 text-pink-400" />
                        )
                      )}
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className={`rounded-lg p-3 ${
                      isCeoMode ? 'bg-muted' : 'bg-pink-50 dark:bg-pink-900/20'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {isCeoMode ? (
                          <Bot className="h-4 w-4 text-primary" />
                        ) : (
                          <Heart className="h-4 w-4 text-pink-400" />
                        )}
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-current rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-current rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-current rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isCeoMode 
                    ? "Enter mission parameters..." 
                    : "Type your message..."
                }
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                size="sm"
                className={
                  isCeoMode 
                    ? 'bg-gradient-to-r from-primary to-primary-glow' 
                    : 'bg-gradient-to-r from-pink-400 to-purple-400'
                }
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatBot;