'use client';

import { useState, useMemo } from 'react';
import type { User, Message } from '@/types';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { suggestReplies, SuggestRepliesOutput } from '@/ai/flows/suggest-replies';

interface ChatPanelProps {
  currentUser: User;
  selectedUser: User;
}

export function ChatPanel({ currentUser, selectedUser }: ChatPanelProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const chatId = useMemo(() => {
    const ids = [currentUser.uid, selectedUser.uid];
    return ids.sort().join('_');
  }, [currentUser.uid, selectedUser.uid]);

  const handleNewMessage = async (message: Message) => {
    // Only generate replies for incoming messages
    if (message.senderId !== currentUser.uid) {
      setIsGenerating(true);
      setSuggestions([]);
      try {
        const result: SuggestRepliesOutput = await suggestReplies({ message: message.text });
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsGenerating(false);
      }
    } else {
        // Clear suggestions after sending a message
        setSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedUser={selectedUser} />
      <MessageList
        chatId={chatId}
        currentUser={currentUser}
        onNewMessage={handleNewMessage}
      />
      <MessageInput
        chatId={chatId}
        currentUser = {currentUser}
        suggestions={suggestions}
        isGeneratingSuggestions={isGenerating}
        onMessageSent={() => handleNewMessage({} as Message)} // a bit of a hack to clear suggestions
      />
    </div>
  );
}
