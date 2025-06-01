
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { UserProfileCard } from '@/components/user/user-profile-card';
import { RecommendationEngine } from '@/components/recommendations/recommendation-engine';
import { EventDiscoverySection } from '@/components/events/event-discovery-section';
import { CommunityCard } from '@/components/communities/community-card';
import type { UserProfile, Community } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CreateEventForm } from '@/components/events/create-event-form';
import { CreateCommunityForm } from '@/components/communities/create-community-form';
import { SectionTitle } from '@/components/layout/section-title';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Compass, CalendarDays, Users, PlusCircle, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockCommunitiesData } from '@/lib/mock-data'; 

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
  const [activeTab, setActiveTab] = useState('discover');
  const [communities, setCommunities] = useState<Community[]>(mockCommunitiesData);
  const router = useRouter();
  const { toast } = useToast();

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
          setUserProfile(initialMockUserProfile); 
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
      const savedTab = localStorage.getItem('lastActiveTab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, [isClient]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('lastActiveTab');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isClient) {
      localStorage.setItem('lastActiveTab', value);
    }
  };

  const handleAddCommunity = (newCommunity: Community) => {
    setCommunities(prevCommunities => [newCommunity, ...prevCommunities]);
    toast({
      title: "Community Added",
      description: `${newCommunity.name} is now in your list.`,
    });
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header userProfile={displayProfile} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8"> {/* Increased mb-6 to mb-8 */}
            <TabsTrigger value="discover">
              <Compass className="mr-2 h-5 w-5" /> Discover {/* Increased icon size */}
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarDays className="mr-2 h-5 w-5" /> Events {/* Increased icon size */}
            </TabsTrigger>
            <TabsTrigger value="communities">
              <Users className="mr-2 h-5 w-5" /> Communities {/* Increased icon size */}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <div className="space-y-10"> {/* Increased space-y-8 to space-y-10 */}
              <Accordion type="single" collapsible className="w-full mb-8 border-none shadow-none"> {/* Removed border and shadow from accordion container */}
                <AccordionItem value="item-1" className="border rounded-xl shadow-md"> {/* Added rounding and shadow to item */}
                  <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:text-primary text-lg"> {/* Increased text size */}
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" /> {/* Increased icon size */}
                      <span className="font-semibold font-headline">Get Personalized Suggestions</span>
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
              <SectionTitle icon={<CalendarDays className="mr-3 h-7 w-7 text-primary" />} title="All Events" /> {/* Increased icon size and margin */}
              <CreateEventForm>
                <Button variant="default" className="mt-4 md:mt-0 rounded-lg text-base py-2.5 px-5"> {/* Used primary color, slightly larger text and padding */}
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Event
                </Button>
              </CreateEventForm>
            </div>
            <EventDiscoverySection />
          </TabsContent>

          <TabsContent value="communities">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
               <SectionTitle icon={<Users className="mr-3 h-7 w-7 text-primary" />} title="Explore Communities" /> {/* Increased icon size and margin */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="mt-4 md:mt-0 rounded-lg text-base py-2.5 px-5"> {/* Used primary color, slightly larger text and padding */}
                    <PlusCircle className="mr-2 h-5 w-5" /> Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg shadow-lg"> {/* Added rounding and shadow */}
                  <CreateCommunityForm onCommunityCreated={handleAddCommunity}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="py-2 px-3">
                      <Users className="mr-2 h-5 w-5" /> New Community
                    </DropdownMenuItem>
                  </CreateCommunityForm>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {communities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 mt-8 border border-dashed rounded-xl"> {/* Added border and rounding */}
                <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" /> {/* Increased icon size */}
                <h3 className="text-2xl font-semibold text-foreground mb-2 font-headline">No Communities Yet</h3> {/* Increased text size */}
                <p className="text-muted-foreground">Be the first to create one or check back later!</p>
                 <CreateCommunityForm onCommunityCreated={handleAddCommunity}>
                   <Button variant="default" className="mt-6 rounded-lg">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create First Community
                  </Button>
                </CreateCommunityForm>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-8 text-center text-base text-muted-foreground border-t mt-12"> {/* Increased padding and text size */}
        {currentYear ? `© ${currentYear} Synk. All rights reserved.` : `© Synk. All rights reserved.`}
      </footer>
    </div>
  );
}
