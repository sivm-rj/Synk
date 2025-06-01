import type { ForumThread } from '@/types';
import { ForumThreadCard } from './forum-thread-card';
import { SectionTitle } from '@/components/layout/section-title';
import { MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockForumThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Favorite spots for remote work in the city?',
    author: 'JaneDoe',
    lastActivity: '2 hours ago',
    replies: 15,
    community: 'Remote Workers Hub',
  },
  {
    id: '2',
    title: 'Planning a hike next weekend - anyone interested?',
    author: 'AdventureSeeker',
    lastActivity: '5 hours ago',
    replies: 8,
    relatedEvent: 'Weekend Hike at North Peak',
  },
  {
    id: '3',
    title: 'Feedback on the new campus library cafe',
    author: 'Bookworm123',
    lastActivity: '1 day ago',
    replies: 22,
    community: 'University Campus Life',
  },
];

export function ForumsSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <SectionTitle icon={<MessagesSquare className="h-6 w-6 text-primary" />} title="Active Discussions" />
        <Button variant="default" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
          Start New Discussion
        </Button>
      </div>
      <div className="space-y-6">
        {mockForumThreads.map((thread) => (
          <ForumThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </section>
  );
}
