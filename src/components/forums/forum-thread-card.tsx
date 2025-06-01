import type { ForumThread } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface ForumThreadCardProps {
  thread: ForumThread;
}

export function ForumThreadCard({ thread }: ForumThreadCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-lg hover:text-primary transition-colors">
          <Link href={`/forums/thread/${thread.id}`}>{thread.title}</Link>
        </CardTitle>
        <CardDescription className="text-xs">
          {thread.community && <span className="mr-2">In: <Link href={`/community/${thread.community}`} className="text-accent hover:underline">{thread.community}</Link></span>}
          {thread.relatedEvent && <span >Related Event: <Link href={`/event/${thread.relatedEvent}`} className="text-accent hover:underline">{thread.relatedEvent}</Link></span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <User className="h-4 w-4 mr-2 text-primary" />
          <span>Started by: {thread.author}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>Last activity: {thread.lastActivity}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
          <span>{thread.replies} replies</span>
        </div>
      </CardContent>
      <CardContent>
         <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
            <Link href={`/forums/thread/${thread.id}`}>Join Discussion</Link>
          </Button>
      </CardContent>
    </Card>
  );
}
