
import type { ForumThread } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface ForumThreadCardProps {
  thread: ForumThread;
}

export function ForumThreadCard({ thread }: ForumThreadCardProps) {
  // For now, link to a non-existent forum thread page or remove link if not implemented
  // const threadLink = `/forums/thread/${thread.id}`; // This page doesn't exist yet
  const threadLink = `#`; // Placeholder

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-lg hover:text-primary transition-colors">
          {/* <Link href={threadLink}>{thread.title}</Link> */}
          {thread.title} {/* Temporarily remove link until thread pages are built */}
        </CardTitle>
        <CardDescription className="text-xs">
          {thread.communityName && <span className="mr-2">In: <span className="text-accent">{thread.communityName}</span></span>}
          {thread.relatedEvent && <span >Related Event: <Link href={`/events/${thread.relatedEvent}`} className="text-accent hover:underline">{thread.relatedEvent}</Link></span>}
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
         {/* <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
            <Link href={threadLink}>Join Discussion</Link>
          </Button> */}
          {/* Temporarily disable button until thread pages are built */}
          <Button variant="outline" size="sm" className="w-full md:w-auto" disabled>
            Join Discussion (Coming Soon)
          </Button>
      </CardContent>
    </Card>
  );
}
