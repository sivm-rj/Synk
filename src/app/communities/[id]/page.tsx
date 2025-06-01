
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { mockCommunitiesData, mockForumThreads } from '@/lib/mock-data';
import type { Community, UserProfile, ForumThread } from '@/types';
import { Users, ArrowLeft, Loader2, MessageSquare, Users2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionTitle } from '@/components/layout/section-title';
import { ForumThreadCard } from '@/components/forums/forum-thread-card';
import { CreateDiscussionForm } from '@/components/forums/create-discussion-form'; // For creating discussions within community

const initialMockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Alex Johnson',
  avatarUrl: 'https://placehold.co/200x200.png',
  organization: 'State University | Tech Corp',
  bio: 'Passionate about technology, community building, and lifelong learning. Always up for a good discussion or a collaborative project.',
  interests: ['Coding', 'AI Ethics', 'Hiking', 'Photography', 'Startups'],
  isVerified: true,
};

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.id as string;
  
  const [community, setCommunity] = React.useState<Community | null | undefined>(undefined); // undefined for loading
  const [communityThreads, setCommunityThreads] = React.useState<ForumThread[]>([]);
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
    const foundCommunity = mockCommunitiesData.find(c => c.id === communityId);
    setCommunity(foundCommunity || null);

    if (foundCommunity) {
      const threads = mockForumThreads.filter(thread => thread.communityId === communityId);
      setCommunityThreads(threads);
    } else {
      setCommunityThreads([]);
    }
  }, [communityId]);

  React.useEffect(() => {
    if (isClient) {
      setCurrentYear(new Date().getFullYear());
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
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
    }
  }, [isClient, router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  if (community === undefined || isLoadingProfile || !isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Community Details...</p>
      </div>
    );
  }

  if (community === null) {
    return (
      <div className="flex flex-col min-h-screen">
        {userProfile && <Header userProfile={userProfile} handleLogout={handleLogout} />}
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <SectionTitle title="Community Not Found" subtitle="Sorry, we couldn't find the community you're looking for." />
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          {currentYear ? `© ${currentYear} Synk. All rights reserved.` : `© Synk. All rights reserved.`}
        </footer>
      </div>
    );
  }

  const displayProfile = userProfile || initialMockUserProfile;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header userProfile={displayProfile} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Communities
        </Button>
        
        <Card className="shadow-xl overflow-hidden">
          <div className="relative h-64 md:h-80 w-full">
            <Image 
              src={community.imageUrl} 
              alt={community.name} 
              fill={true}
              style={{objectFit: 'cover'}}
              data-ai-hint="community gathering group"
            />
          </div>
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{community.name}</CardTitle>
            <div className="flex items-center text-muted-foreground mt-2">
              <Users2 className="h-5 w-5 mr-2 text-primary" />
              <span>{community.memberCount} members</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-lg text-foreground leading-relaxed">{community.description}</p>
            
            <div className="border-t pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 className="text-2xl font-semibold flex items-center font-headline text-primary">
                  <MessageSquare className="mr-2 h-6 w-6" />
                  Community Discussions
                </h3>
                <CreateDiscussionForm>
                   <Button variant="default" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-5 w-5" /> Start New Discussion
                  </Button>
                </CreateDiscussionForm>
              </div>
              {communityThreads.length > 0 ? (
                <div className="space-y-4">
                  {communityThreads.map(thread => <ForumThreadCard key={thread.id} thread={thread} />)}
                </div>
              ) : (
                <p className="text-muted-foreground">No discussions in this community yet. Be the first to start one!</p>
              )}
            </div>

            <div className="pt-4">
                 <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    Join Community
                 </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        {currentYear ? `© ${currentYear} Synk. All rights reserved.` : `© Synk. All rights reserved.`}
      </footer>
    </div>
  );
}
