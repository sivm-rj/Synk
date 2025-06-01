
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { UserProfileCard } from '@/components/user/user-profile-card';
import { RecommendationEngine } from '@/components/recommendations/recommendation-engine';
import { EventDiscoverySection } from '@/components/events/event-discovery-section';
import { ForumsSection } from '@/components/forums/forums-section';
import type { UserProfile } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CreateEventForm } from '@/components/events/create-event-form';
import { CreateCommunityForm } from '@/components/communities/create-community-form';
import { CreateDiscussionForm } from '@/components/forums/create-discussion-form';
import { SectionTitle } from '@/components/layout/section-title';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Compass, CalendarDays, Users, PlusCircle, Loader2, Sparkles, MessageSquare } from 'lucide-react';

const initialMockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Alex Johnson',
  avatarUrl: 'https://placehold.co/200x200.png',
  organization: 'State University | Tech Corp',
  bio: 'Passionate about technology, community building, and lifelong learning. Always up for a good discussion or a collaborative project.',
  interests: ['Coding', 'AI Ethics', 'Hiking', 'Photography', 'Startups'],
  isVerified: true,
};

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedInStatus);

    if (!loggedInStatus) {
      router.replace('/login');
    } else {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error("Failed to parse user profile from localStorage", e);
          setUserProfile(initialMockUserProfile); // Fallback to mock if parsing fails
        }
      } else {
        setUserProfile(initialMockUserProfile);
      }
    }
    setIsLoadingProfile(false);
  }, [router]);

  useEffect(() => {
    if (isClient) { 
      setCurrentYear(new Date().getFullYear());
    }
  }, [isClient]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isClient || !isAuthenticated || isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Synk...</p>
      </div>
    );
  }
  
  const displayProfile = userProfile || initialMockUserProfile;

  return (
    <div className="flex flex-col min-h-screen">
      <Header userProfile={displayProfile} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="discover">
              <Compass className="mr-2 h-4 w-4" /> Discover
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarDays className="mr-2 h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="communities">
              <Users className="mr-2 h-4 w-4" /> Communities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <div className="space-y-8">
              <Accordion type="single" collapsible className="w-full mb-8">
                <AccordionItem value="item-1" className="border border-border rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg font-headline">Get Personalized Suggestions</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <RecommendationEngine userProfile={displayProfile} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <EventDiscoverySection />
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <SectionTitle icon={<CalendarDays className="mr-2 h-6 w-6 text-primary" />} title="All Events" />
              <CreateEventForm>
                <Button variant="default" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Event
                </Button>
              </CreateEventForm>
            </div>
            <EventDiscoverySection />
          </TabsContent>

          <TabsContent value="communities">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <SectionTitle icon={<Users className="mr-2 h-6 w-6 text-primary" />} title="Communities & Discussions" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <CreateCommunityForm>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" /> New Community
                    </DropdownMenuItem>
                  </CreateCommunityForm>
                  <CreateDiscussionForm>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" /> New Discussion
                    </DropdownMenuItem>
                  </CreateDiscussionForm>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ForumsSection />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        {currentYear ? `© ${currentYear} Synk. All rights reserved.` : `© Synk. All rights reserved.`}
      </footer>
    </div>
  );
}

