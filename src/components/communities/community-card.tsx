
import type { Community } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 w-full">
        <Image 
          src={community.imageUrl} 
          alt={community.name} 
          layout="fill" 
          objectFit="cover" 
          data-ai-hint="community group gathering" // Generic hint, can be more specific if data allows
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{community.name}</CardTitle>
        <CardDescription>{community.description.substring(0,100)}{community.description.length > 100 ? '...' : ''}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        <div className="flex items-center text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <span>{community.memberCount} members</span>
        </div>
      </CardContent>
      <CardFooter>
        {/* Link to a future community detail page */}
        <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          {/* Update href once community detail pages are implemented, e.g., /communities/${community.id} */}
          <Link href="#"> 
            View Community <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

