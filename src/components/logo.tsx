import { MessagesSquare } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <MessagesSquare className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-foreground">
        WhisperNet
      </h1>
    </div>
  );
}
