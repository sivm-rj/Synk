
import type { Community, Event, ForumThread } from '@/types';

export const mockCommunitiesData: Community[] = [
  {
    id: 'comm1',
    name: 'City Coders',
    description: 'A vibrant community for developers in the city. Share, learn, and connect with fellow tech enthusiasts!',
    memberCount: 120,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'comm2',
    name: 'Outdoor Adventures Club',
    description: 'Exploring the great outdoors together. Join us for hikes, camping trips, and nature photography sessions.',
    memberCount: 75,
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'comm3',
    name: 'Founders Hub',
    description: 'A supportive network for startup founders and entrepreneurs. Share challenges, successes, and resources.',
    memberCount: 250,
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export const mockEvents: Event[] = [
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

export const mockForumThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Favorite spots for remote work in the city?',
    author: 'JaneDoe',
    lastActivity: '2 hours ago',
    replies: 15,
    communityId: 'comm1', // Linked to City Coders
    communityName: 'City Coders',
  },
  {
    id: '2',
    title: 'Planning a hike next weekend - anyone interested?',
    author: 'AdventureSeeker',
    lastActivity: '5 hours ago',
    replies: 8,
    relatedEvent: 'Weekend Hike at North Peak',
    communityId: 'comm2', // Linked to Outdoor Adventures Club
    communityName: 'Outdoor Adventures Club',
  },
  {
    id: '3',
    title: 'Feedback on the new campus library cafe',
    author: 'Bookworm123',
    lastActivity: '1 day ago',
    replies: 22,
    communityId: 'comm-uni', // Example: University Campus Life
    communityName: 'University Campus Life',
  },
];
