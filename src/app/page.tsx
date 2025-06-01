import { Header } from '@/components/layout/header';
import { UserProfileCard } from '@/components/user/user-profile-card';
import { RecommendationEngine } from '@/components/recommendations/recommendation-engine';
import { EventDiscoverySection } from '@/components/events/event-discovery-section';
import { ForumsSection } from '@/components/forums/forums-section';
import type { UserProfile } from '@/types';
import { Separator } from '@/components/ui/separator';

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column / Top Section on Mobile */}
          <div className="lg:col-span-1 space-y-8">
            <UserProfileCard profile={mockUserProfile} />
            <RecommendationEngine />
          </div>

          {/* Right Column / Bottom Section on Mobile */}
          <div className="lg:col-span-2 space-y-8">
            <EventDiscoverySection />
            <Separator />
            <ForumsSection />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} CampusConnect. All rights reserved.
      </footer>
    </div>
  );
}
