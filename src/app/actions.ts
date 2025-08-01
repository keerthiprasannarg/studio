'use server';

import { auth, db } from '@/lib/firebase';
import { Message } from '@/types';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function sendMessage(chatId: string, messageText: string, currentUser: User) {
  if (!currentUser) {
    throw new Error('User is not authenticated.');
  }

  if (!messageText.trim()) {
    throw new Error('Message cannot be empty.');
  }

  const messagesCol = collection(db, 'chats', chatId, 'messages');
  
  const messageData: Omit<Message, 'id' | 'timestamp'> & { timestamp: any } = {
    text: messageText,
    senderId: currentUser.uid,
    timestamp: serverTimestamp(),
  };

  await addDoc(messagesCol, messageData);
}
