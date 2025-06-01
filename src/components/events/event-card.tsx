
import type { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={event.imageUrl} 
          alt={event.name} 
          layout="fill" 
          objectFit="cover" 
          data-ai-hint="event gathering"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{event.name}</CardTitle>
        <CardDescription>{event.description.substring(0,100)}{event.description.length > 100 ? '...' : ''}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
          <span>{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <span>{event.attendees} attending {event.capacity ? `/ ${event.capacity}` : ''}</span>
        </div>
        <p className="text-xs text-muted-foreground">Organized by: {event.organizer}</p>
        {event.community && <p className="text-xs text-muted-foreground">Community: {event.community}</p>}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
