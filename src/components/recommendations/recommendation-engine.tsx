'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { suggestCommunitiesAndEvents, type SuggestCommunitiesAndEventsInput, type SuggestCommunitiesAndEventsOutput } from '@/ai/flows/community-and-event-suggestions';
import { Loader2, Sparkles, Users, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { RecommendationResult } from '@/types';

export function RecommendationEngine() {
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests || !location) {
      toast({
        title: "Missing Information",
        description: "Please enter your interests and location.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setRecommendations(null);

    try {
      const input: SuggestCommunitiesAndEventsInput = { interests, location };
      const result: SuggestCommunitiesAndEventsOutput = await suggestCommunitiesAndEvents(input);
      
      setRecommendations({
        suggestedCommunities: result.suggestedCommunities ? result.suggestedCommunities.split(',').map(s => s.trim()).filter(s => s) : [],
        suggestedEvents: result.suggestedEvents ? result.suggestedEvents.split(',').map(s => s.trim()).filter(s => s) : [],
      });

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-6 w-6 text-primary" />
          Personalized Suggestions
        </CardTitle>
        <CardDescription>
          Tell us your interests and location to discover communities and events tailored for you.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="interests" className="font-medium">Your Interests</Label>
            <Input
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., coding, hiking, photography"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate interests with a comma.</p>
          </div>
          <div>
            <Label htmlFor="location" className="font-medium">Your Location</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
              className="mt-1"
            />
             <p className="text-xs text-muted-foreground mt-1">Enter your city and state/country.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Suggestions
          </Button>
        </CardFooter>
      </form>

      {recommendations && (
        <CardContent className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 font-headline">Here are your suggestions:</h3>
          {recommendations.suggestedCommunities.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                Suggested Communities
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {recommendations.suggestedCommunities.map((community, index) => (
                  <li key={`community-${index}`}>{community}</li>
                ))}
              </ul>
            </div>
          )}
          {recommendations.suggestedEvents.length > 0 && (
            <div>
              <h4 className="text-md font-semibold flex items-center gap-2 mb-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Suggested Events
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {recommendations.suggestedEvents.map((event, index) => (
                  <li key={`event-${index}`}>{event}</li>
                ))}
              </ul>
            </div>
          )}
           {(recommendations.suggestedCommunities.length === 0 && recommendations.suggestedEvents.length === 0) && (
             <p className="text-sm text-muted-foreground">No specific suggestions found. Try broadening your interests or location.</p>
           )}
        </CardContent>
      )}
    </Card>
  );
}
