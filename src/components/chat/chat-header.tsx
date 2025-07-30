import type { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  selectedUser: User;
}

export function ChatHeader({ selectedUser }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Avatar>
        <AvatarImage src={selectedUser.photoURL || ''} alt={selectedUser.displayName || 'User'} data-ai-hint="avatar" />
        <AvatarFallback>{selectedUser.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{selectedUser.displayName}</h2>
        <p className="text-sm text-muted-foreground">Active now</p>
      </div>
    </div>
  );
}
