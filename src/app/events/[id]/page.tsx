
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { mockEvents } from '@/lib/mock-data'; // Import from new location
import type { Event, UserProfile } from '@/types';
import { CalendarDays, MapPin, Users, ArrowLeft, Briefcase, Users2, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from '@/components/layout/section-title';

const initialMockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Alex Johnson',
  avatarUrl: 'https://placehold.co/200x200.png',
  organization: 'State University | Tech Corp',
  bio: 'Passionate about technology, community building, and lifelong learning. Always up for a good discussion or a collaborative project.',
  interests: ['Coding', 'AI Ethics', 'Hiking', 'Photography', 'Startups'],
  isVerified: true,
};


export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [event, setEvent] = React.useState<Event | null | undefined>(undefined); // undefined for loading
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);


  React.useEffect(() => {
    setIsClient(true);
    const foundEvent = mockEvents.find(e => e.id === eventId);
    setEvent(foundEvent || null);
  }, [eventId]);

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

  if (event === undefined || isLoadingProfile || !isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading Event Details...</p>
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="flex flex-col min-h-screen">
        {userProfile && <Header userProfile={userProfile} handleLogout={handleLogout} />}
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <SectionTitle title="Event Not Found" subtitle="Sorry, we couldn't find the event you're looking for." />
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
        
        <Card className="shadow-xl overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image 
              src={event.imageUrl} 
              alt={event.name} 
              fill={true}
              style={{objectFit: 'cover'}}
              data-ai-hint="event banner public"
            />
          </div>
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{event.name}</CardTitle>
            {event.community && (
              <Badge variant="secondary" className="mt-2 w-fit">
                <Users2 className="mr-1.5 h-4 w-4" /> Community: {event.community}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-lg text-foreground leading-relaxed">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-start">
                  <CalendarDays className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Organizer</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Attendance</p>
                    <p className="text-muted-foreground">
                      {event.attendees} attending
                      {event.capacity ? ` (Capacity: ${event.capacity})` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
             <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center font-headline">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Event Discussion
                </h3>
                <p className="text-muted-foreground">Event-specific discussion forum coming soon!</p>
                {/* Placeholder for event-specific forum/comments */}
            </div>

            <div className="pt-4">
                 <Button size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3 px-6">
                    Register for this Event
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
