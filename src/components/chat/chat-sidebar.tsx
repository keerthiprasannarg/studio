'use client';

import type { User } from '@/types';
import { UserItem } from './user-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '../logo';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface ChatSidebarProps {
  currentUser: User;
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

export function ChatSidebar({ currentUser, users, selectedUser, onUserSelect }: ChatSidebarProps) {
  
  const handleSignOut = () => {
    auth.signOut();
  }

  return (
    <aside className="w-full max-w-xs flex flex-col border-r bg-background">
      <div className="p-4 border-b flex justify-between items-center">
        <Logo />
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {users.map((user) => (
            <UserItem
              key={user.uid}
              user={user}
              isSelected={selectedUser?.uid === user.uid}
              onSelect={() => onUserSelect(user)}
            />
          ))}
        </nav>
      </ScrollArea>
       <div className="p-4 border-t text-sm text-muted-foreground">
        <p>Logged in as <strong>{currentUser.displayName}</strong></p>
       </div>
    </aside>
  );
}
