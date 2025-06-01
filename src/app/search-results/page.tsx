
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { SectionTitle } from '@/components/layout/section-title';
import { mockEvents } from '@/components/events/event-discovery-section';
import { mockForumThreads } from '@/components/forums/forums-section';
import { EventCard } from '@/components/events/event-card';
import { ForumThreadCard } from '@/components/forums/forum-thread-card';
import type { Event, ForumThread } from '@/types';
import { Search, CalendarDays, Users, MessageSquare } from 'lucide-react';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [filteredEvents, setFilteredEvents] = React.useState<Event[]>([]);
  const [filteredForumThreads, setFilteredForumThreads] = React.useState<ForumThread[]>([]);

  React.useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      
      const events = mockEvents.filter(event => 
        event.name.toLowerCase().includes(lowerCaseQuery) ||
        event.description.toLowerCase().includes(lowerCaseQuery) ||
        (event.community && event.community.toLowerCase().includes(lowerCaseQuery)) ||
        event.organizer.toLowerCase().includes(lowerCaseQuery) ||
        event.location.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredEvents(events);

      const forums = mockForumThreads.filter(thread =>
        thread.title.toLowerCase().includes(lowerCaseQuery) ||
        thread.author.toLowerCase().includes(lowerCaseQuery) ||
        (thread.community && thread.community.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredForumThreads(forums);
    } else {
      setFilteredEvents([]);
      setFilteredForumThreads([]);
    }
  }, [query]);

  const hasResults = filteredEvents.length > 0 || filteredForumThreads.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SectionTitle 
          icon={<Search className="h-7 w-7 text-primary" />} 
          title={query ? `Search Results for "${query}"` : "Search"}
          subtitle={query && !hasResults ? "No results found. Try a different search term." : (query ? `${filteredEvents.length + filteredForumThreads.length} results found.` : "Please enter a search term in the header.")}
        />

        {query && hasResults && (
          <div className="space-y-8">
            {filteredEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center font-headline">
                  <CalendarDays className="mr-2 h-6 w-6 text-accent" /> Events ({filteredEvents.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
              </section>
            )}

            {filteredForumThreads.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center font-headline">
                  <MessageSquare className="mr-2 h-6 w-6 text-accent" /> Forum Discussions ({filteredForumThreads.length})
                </h2>
                <div className="space-y-6">
                  {filteredForumThreads.map(thread => <ForumThreadCard key={thread.id} thread={thread} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Synk. All rights reserved.
      </footer>
    </div>
  );
}
