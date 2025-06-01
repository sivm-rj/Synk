
import type { ForumThread } from '@/types';
import { ForumThreadCard } from './forum-thread-card';
import { MessagesSquare, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/layout/section-title';

export const mockForumThreads: ForumThread[] = [
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
    community: 'Outdoor Adventures Club',
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
    <section className="pt-2 pb-8 md:pb-12">
      {/* The "Start New Discussion" button has been moved to a dropdown in page.tsx */}
      <div className="space-y-6 mt-6">
        {mockForumThreads.map((thread) => (
          <ForumThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </section>
  );
}
