'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CornerDownLeft, Send, Sparkles } from 'lucide-react';
import { sendMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/components/auth-provider';

interface MessageInputProps {
  chatId: string;
  suggestions: string[];
  isGeneratingSuggestions: boolean;
  onMessageSent: () => void;
}

export function MessageInput({ chatId, suggestions, isGeneratingSuggestions, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { user, loading } = useAuth(); 

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    console.log(chatId, text)
    try {
      console.log("sending message", text)
      await sendMessage(chatId, text);
      setMessage('');
      onMessageSent();
    } catch (error: any) {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitting message", message)
    handleSend(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="p-4 border-t bg-background">
        <div className="mb-2 h-9">
            {isGeneratingSuggestions && (
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                </div>
            )}
            {!isGeneratingSuggestions && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(s)}
                        className="animate-fade-in-up"
                        style={{animationDelay: `${i * 100}ms`}}
                    >
                        <Sparkles className="h-4 w-4 mr-2 text-accent" />
                        {s}
                    </Button>
                ))}
                </div>
            )}
        </div>
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="pr-20 min-h-[50px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <p className="text-xs text-muted-foreground mr-2 hidden sm:block">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-sm">↵</span>
                </kbd>
                 Send
            </p>
            <Button type="submit" size="icon" disabled={!message.trim()}>
                <Send className="h-5 w-5" />
            </Button>
        </div>
      </form>
    </div>
  );
}
