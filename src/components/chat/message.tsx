import type { User, Message as MessageType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
  currentUser: User;
}

export function Message({ message, currentUser }: MessageProps) {
  const isCurrentUser = message.senderId === currentUser.uid;

  const getInitials = (name: string | null) => {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  return (
    <div
      className={cn(
        'flex items-end gap-3 max-w-[75%] animate-fade-in-up',
        isCurrentUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={isCurrentUser ? currentUser.photoURL || '' : ''} alt={currentUser.displayName || ''} data-ai-hint="avatar" />
        <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'p-3 rounded-2xl',
          isCurrentUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-secondary text-secondary-foreground rounded-bl-sm'
        )}
      >
        <p className="text-sm">{message.text}</p>
         <p className={cn(
             "text-xs mt-1",
             isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
         )}>
             {message.timestamp ? format(message.timestamp.toDate(), 'p') : 'sending...'}
         </p>
      </div>
    </div>
  );
}
