import { useState } from "react";
import { Send, Bot, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  references?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Does GDPR allow storing customer data indefinitely?",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "2",
    role: "assistant",
    content: `**No, GDPR does not allow indefinite storage of customer data.**

According to **GDPR Article 5(1)(e)** - the "storage limitation" principle - personal data must be:

• Kept in a form which permits identification of data subjects for **no longer than necessary** for the purposes for which the data is processed

• Personal data may be stored for longer periods only for archiving purposes in the public interest, scientific/historical research, or statistical purposes

**Recommendation:** Implement a clear data retention policy that defines specific retention periods for each category of personal data, with automatic deletion or anonymization procedures.`,
    timestamp: new Date(Date.now() - 30000),
    references: ["GDPR Art. 5(1)(e)", "GDPR Art. 17"],
  },
];

const quickPrompts = [
  "Data retention limits",
  "Employment bias policies",
  "ISO 27001 access control",
  "Right to erasure",
];

export function PolicyChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I found relevant information about "${input}". Based on your organization's policy framework and applicable regulations, here's what you need to know...

This is a simulated response. In production, this would connect to your policy database and AI backend for real compliance guidance.`,
        timestamp: new Date(),
        references: ["Internal Policy DB", "Compliance Framework"],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="enterprise-card h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              PolicyProof AI
            </h2>
            <p className="text-xs text-muted-foreground">
              Compliance Intelligence Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
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
                "max-w-[80%] space-y-2",
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
                  message.role === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-assistant"
                )}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
              {message.references && message.references.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {message.references.map((ref) => (
                    <span
                      key={ref}
                      className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              )}
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
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about GDPR, ISO, SOC 2, internal policies…"
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
