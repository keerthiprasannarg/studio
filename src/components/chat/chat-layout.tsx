import type { User } from '@/types';
import { ChatSidebar } from './chat-sidebar';
import { ChatPanel } from './chat-panel';

interface ChatLayoutProps {
  currentUser: User;
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

export function ChatLayout({ currentUser, users, selectedUser, onUserSelect }: ChatLayoutProps) {
  return (
    <div className="flex h-screen bg-card">
      <ChatSidebar 
        currentUser={currentUser}
        users={users}
        selectedUser={selectedUser}
        onUserSelect={onUserSelect}
      />
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatPanel 
            key={selectedUser.uid} // Re-mounts the panel when user changes
            currentUser={currentUser} 
            selectedUser={selectedUser} 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}
