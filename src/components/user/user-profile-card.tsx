
import type { UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, UserCircle2 } from 'lucide-react';

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="profile person" />
          <AvatarFallback>
            <UserCircle2 className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-2xl">{profile.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          {profile.organization}
          {profile.isVerified && (
            <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs px-1.5 py-0.5">
              <CheckCircle className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 text-center">{profile.bio}</p>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 font-headline">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
             {profile.interests.length === 0 && <p className="text-xs text-muted-foreground">No interests added yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
