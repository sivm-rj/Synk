
import type { UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, UserCircle2 } from 'lucide-react';

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-24 w-24 mb-3">
          <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint="profile person" />
          <AvatarFallback>
            <UserCircle2 className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-xl">{profile.name}</CardTitle>
        
        {(profile.organization || profile.isVerified) && (
          <div className="flex flex-col items-center gap-1.5 mt-2 text-sm">
            {profile.organization && (
                <p className="text-muted-foreground">{profile.organization}</p>
            )}
            {profile.isVerified && (
                <Badge 
                  variant="outline"
                  className="border-green-500 bg-green-50 text-green-700 text-xs px-2 py-0.5 font-medium"
                >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Verified
                </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 space-y-5">
        {profile.bio && (
          <>
            <div>
                <h4 className="text-sm font-semibold mb-1.5 text-muted-foreground text-center">Bio</h4>
                <p className="text-sm text-foreground text-center leading-relaxed">{profile.bio}</p>
            </div>
            <Separator />
          </>
        )}
        
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground text-center">Interests</h4>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {profile.interests.length > 0 ? profile.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs py-1 px-2.5">
                {interest}
              </Badge>
            )) : <p className="text-xs text-muted-foreground text-center">No interests added yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
