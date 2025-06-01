
import { ForumThreadCard } from './forum-thread-card';
import { mockForumThreads } from '@/lib/mock-data'; // Import from new location

export function ForumsSection() {
  return (
    <section className="pt-2 pb-8 md:pb-12">
      <div className="space-y-6 mt-6">
        {mockForumThreads.map((thread) => (
          <ForumThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </section>
  );
}
