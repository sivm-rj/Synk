
import { Header } from '@/components/layout/header';
import { UserProfileCard } from '@/components/user/user-profile-card';
import { RecommendationEngine } from '@/components/recommendations/recommendation-engine';
import { EventDiscoverySection } from '@/components/events/event-discovery-section';
import { ForumsSection } from '@/components/forums/forums-section';
import type { UserProfile } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, CalendarDays, Users, User as UserIcon } from 'lucide-react';

const mockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Alex Johnson',
  avatarUrl: 'https://placehold.co/200x200.png',
  organization: 'State University | Tech Corp',
  bio: 'Passionate about technology, community building, and lifelong learning. Always up for a good discussion or a collaborative project.',
  interests: ['Coding', 'AI Ethics', 'Hiking', 'Photography', 'Startups'],
  isVerified: true,
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="discover">
              <Compass className="mr-2 h-4 w-4" /> Discover
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarDays className="mr-2 h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="communities">
              <Users className="mr-2 h-4 w-4" /> Communities
            </TabsTrigger>
            <TabsTrigger value="profile">
              <UserIcon className="mr-2 h-4 w-4" /> My Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <EventDiscoverySection />
          </TabsContent>

          <TabsContent value="events">
            {/* For now, also showing EventDiscoverySection here. Can be customized later. */}
            <EventDiscoverySection />
          </TabsContent>

          <TabsContent value="communities">
            <ForumsSection />
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-8">
                <UserProfileCard profile={mockUserProfile} />
              </div>
              <div className="md:col-span-2 space-y-8">
                 <RecommendationEngine />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} CampusConnect. All rights reserved.
      </footer>
    </div>
  );
}
