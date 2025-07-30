import type { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserItemProps {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
}

export function UserItem({ user, isSelected, onSelect }: UserItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-200',
        isSelected ? 'bg-secondary' : 'hover:bg-secondary/50'
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} data-ai-hint="avatar" />
        <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <p className="font-semibold text-foreground">{user.displayName}</p>
        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
      </div>
    </button>
  );
}
