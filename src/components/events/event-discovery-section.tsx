
import type { Event } from '@/types';
import { EventCard } from './event-card';
import { SectionTitle } from '@/components/layout/section-title';
import { CreateEventForm } from './create-event-form';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Meetup: Future of AI',
    description: 'Join us for an exciting discussion on the latest advancements in Artificial Intelligence and its impact on various industries. Network with professionals and enthusiasts.',
    date: 'August 15, 2024',
    time: '6:00 PM',
    location: 'Downtown Innovation Hub',
    imageUrl: 'https://placehold.co/600x400.png',
    organizer: 'Tech Enthusiasts Group',
    community: 'City Coders',
    attendees: 45,
    capacity: 100,
  },
  {
    id: '2',
    name: 'Photography Workshop: Urban Landscapes',
    description: 'Capture the beauty of our city. This workshop covers techniques for urban landscape photography. Suitable for all skill levels.',
    date: 'August 22, 2024',
    time: '2:00 PM',
    location: 'City Art Gallery',
    imageUrl: 'https://placehold.co/600x400.png',
    organizer: 'Shutterbugs Club',
    attendees: 20,
    capacity: 30,
  },
  {
    id: '3',
    name: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and mentors. Share your ideas and build valuable connections in the startup ecosystem.',
    date: 'August 29, 2024',
    time: '7:00 PM',
    location: 'The Co-Working Space',
    imageUrl: 'https://placehold.co/600x400.png',
    organizer: 'Startup Guild',
    community: 'Founders Hub',
    attendees: 70,
  },
];

export function EventDiscoverySection() {
  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <SectionTitle icon={<Search className="h-6 w-6 text-primary" />} title="Discover Local Events" />
        <CreateEventForm>
          <Button variant="default" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Event
          </Button>
        </CreateEventForm>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
