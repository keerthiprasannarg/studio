'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChatLayout } from './chat-layout';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatAppProps {
  currentUser: User;
}

export function ChatApp({ currentUser }: ChatAppProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersQuery = query(collection(db, 'users'), where('uid', '!=', currentUser.uid));
      
      // Use onSnapshot for real-time user updates (e.g., new users signing up)
      const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
        const usersData = querySnapshot.docs.map(doc => doc.data() as User);
        setUsers(usersData);
        if (!selectedUser && usersData.length > 0) {
            setSelectedUser(usersData[0]);
        }
        setLoading(false);
      });
      
      return () => unsubscribe();
    };

    fetchUsers();
  }, [currentUser.uid, selectedUser]);

  if (loading) {
     return (
        <div className="flex h-screen">
          <div className="w-1/4 min-w-[280px] max-w-[320px] border-r p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <Skeleton className="h-10 w-1/4" />
              </div>
              <div className="flex-1 p-4" />
              <div className="p-4 border-t">
                  <Skeleton className="h-20 w-full" />
              </div>
          </div>
        </div>
     )
  }

  return (
    <ChatLayout
      currentUser={currentUser}
      users={users}
      selectedUser={selectedUser}
      onUserSelect={setSelectedUser}
    />
  );
}
