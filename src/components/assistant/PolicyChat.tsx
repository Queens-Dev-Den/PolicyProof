import { useState } from "react";
import { Send, Bot, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDocumentContext } from "@/context/DocumentContext";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  referencedFrameworks?: string[];
  relevantArticles?: Array<{ title: string; source: string; url: string }>;
}

export function PolicyChat() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { selectedFrameworks, chatMessages, setChatMessages } = useDocumentContext();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          frameworks: selectedFrameworks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        referencedFrameworks: data.referenced_frameworks || [],
        relevantArticles: data.relevant_articles || [],
      };

      setChatMessages([...chatMessages, userMessage, assistantMessage]);
      
      // Emit event to update PolicyContext panel
      const event = new CustomEvent("updatePolicyContext", {
        detail: {
          referencedFrameworks: data.referenced_frameworks || [],
          relevantArticles: data.relevant_articles || [],
        },
      });
      window.dispatchEvent(event);

      setIsTyping(false);
    } catch (error) {
      console.error('Error calling assistant API:', error);
      toast.error('Failed to get response from assistant. Please try again.');
      setIsTyping(false);
      
      // Remove user message if API call failed
      setChatMessages(chatMessages.filter(msg => msg.id !== userMessage.id));
      setInput(currentInput); // Restore input
    }
  };

  return (
    <div className="enterprise-card h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
        {chatMessages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              PolicyProof AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Ask questions about your selected compliance frameworks. I can help you understand regulations, policies, and best practices.
            </p>
            <div className="grid grid-cols-1 gap-2 max-w-md w-full">
              <div className="text-xs text-muted-foreground text-left px-4 py-2 rounded-md bg-muted/30 border border-border">
                💡 Example: "What are the GDPR requirements for data retention?"
              </div>
              <div className="text-xs text-muted-foreground text-left px-4 py-2 rounded-md bg-muted/30 border border-border">
                💡 Example: "How does HIPAA define protected health information?"
              </div>
              <div className="text-xs text-muted-foreground text-left px-4 py-2 rounded-md bg-muted/30 border border-border">
                💡 Example: "What security controls does ISO 27001 require?"
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                message.role === "user"
                  ? "bg-primary"
                  : "bg-muted"
              )}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] space-y-2 flex flex-col",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {message.role === "user" ? "You" : "PolicyProof AI"}
                </span>
                <Clock className="w-3 h-3" />
                <span>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={cn(
                  "inline-block",
                  message.role === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-assistant"
                )}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0">
              <Bot className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="chat-bubble-assistant">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-subtle" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-subtle delay-100" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-subtle delay-200" />
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask questions about the selected policies…"
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
