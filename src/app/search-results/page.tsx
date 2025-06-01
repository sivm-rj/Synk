
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { SectionTitle } from '@/components/layout/section-title';
import { EventCard } from '@/components/events/event-card';
import { ForumThreadCard } from '@/components/forums/forum-thread-card';
import type { Event, ForumThread, UserProfile } from '@/types';
import { Search, CalendarDays, MessageSquare, Loader2 } from 'lucide-react';
import { mockEvents, mockForumThreads, mockCommunitiesData } from '@/lib/mock-data'; // Import from new location
import { CommunityCard } from '@/components/communities/community-card';
import type { Community } from '@/types';


const initialMockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Alex Johnson',
  avatarUrl: 'https://placehold.co/200x200.png',
  organization: 'State University | Tech Corp',
  bio: 'Passionate about technology, community building, and lifelong learning. Always up for a good discussion or a collaborative project.',
  interests: ['Coding', 'AI Ethics', 'Hiking', 'Photography', 'Startups'],
  isVerified: true,
};


export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const router = useRouter(); // Added to handle navigation and logout

  const [filteredEvents, setFilteredEvents] = React.useState<Event[]>([]);
  const [filteredForumThreads, setFilteredForumThreads] = React.useState<ForumThread[]>([]);
  const [filteredCommunities, setFilteredCommunities] = React.useState<Community[]>([]);

  const [isClient, setIsClient] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  React.useEffect(() => {
    if (isClient) {
      setCurrentYear(new Date().getFullYear());
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      if (!loggedInStatus) {
        // router.replace('/login'); // Comment out for now, search should be public
      } else {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          try {
            setUserProfile(JSON.parse(storedProfile));
          } catch (e) {
            console.error("Failed to parse user profile from localStorage", e);
            setUserProfile(initialMockUserProfile); 
          }
        } else {
          setUserProfile(initialMockUserProfile);
        }
      }
      setIsLoadingProfile(false);
    }
  }, [isClient, router]);


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
        (thread.communityName && thread.communityName.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredForumThreads(forums);

      const communities = mockCommunitiesData.filter(community =>
        community.name.toLowerCase().includes(lowerCaseQuery) ||
        community.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCommunities(communities);

    } else {
      setFilteredEvents([]);
      setFilteredForumThreads([]);
      setFilteredCommunities([]);
    }
  }, [query]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  if (!isClient || isLoadingProfile) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Search...</p>
      </div>
    );
  }

  const displayProfile = userProfile; // Can be null if not logged in
  const hasResults = filteredEvents.length > 0 || filteredForumThreads.length > 0 || filteredCommunities.length > 0;
  const totalResults = filteredEvents.length + filteredForumThreads.length + filteredCommunities.length;


  return (
    <div className="flex flex-col min-h-screen">
      <Header userProfile={displayProfile} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SectionTitle 
          icon={<Search className="h-7 w-7 text-primary" />} 
          title={query ? `Search Results for "${query}"` : "Search"}
          subtitle={query && !hasResults ? "No results found. Try a different search term." : (query ? `${totalResults} results found.` : "Please enter a search term in the header.")}
        />

        {query && hasResults && (
          <div className="space-y-10">
            {filteredCommunities.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center font-headline">
                  <Users className="mr-2 h-6 w-6 text-accent" /> Communities ({filteredCommunities.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCommunities.map(community => <CommunityCard key={community.id} community={community} />)}
                </div>
              </section>
            )}
            
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
       {currentYear ? `© ${currentYear} Synk. All rights reserved.` : `© Synk. All rights reserved.`}
      </footer>
    </div>
  );
}
