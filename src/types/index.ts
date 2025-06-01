export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  organization: string;
  bio: string;
  interests: string[]; // Will be a string for AI input, but an array for display
  isVerified: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  organizer: string;
  community?: string;
  attendees: number;
  capacity?: number;
}

export interface Community {
  id:string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  lastActivity: string;
  replies: number;
  community?: string;
  relatedEvent?: string;
}

export interface RecommendationResult {
  suggestedCommunities: string[];
  suggestedEvents: string[];
}
