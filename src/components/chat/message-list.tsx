'use client';

import { useState, useEffect, useRef } from 'react';
import type { User, Message as MessageType } from '@/types';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from './message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  chatId: string;
  currentUser: User;
  onNewMessage: (message: MessageType) => void;
}

export function MessageList({ chatId, currentUser, onNewMessage }: MessageListProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as MessageType));

      if (newMessages.length > messages.length && messages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.senderId !== currentUser.uid) {
            onNewMessage(lastMessage);
        }
      }
      
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, currentUser.uid, onNewMessage, messages.length]);

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
        <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-16 w-3/5" />
            <Skeleton className="h-16 w-3/5 ml-auto" />
            <Skeleton className="h-10 w-1/2" />
             <Skeleton className="h-16 w-3/5 ml-auto" />
        </div>
    )
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4" ref={viewportRef}>
            {messages.map((message) => (
            <Message key={message.id} message={message} currentUser={currentUser} />
            ))}
        </div>
    </ScrollArea>
  );
}
