
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { suggestCommunitiesAndEvents, type SuggestCommunitiesAndEventsInput, type SuggestCommunitiesAndEventsOutput } from '@/ai/flows/community-and-event-suggestions';
import { Loader2, Sparkles, Users, CalendarDays, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { RecommendationResult, UserProfile } from '@/types';

interface RecommendationEngineProps {
  userProfile: UserProfile | null;
}

export function RecommendationEngine({ userProfile }: RecommendationEngineProps) {
  const [interests, setInterests] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [recommendations, setRecommendations] = React.useState<RecommendationResult | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [isProcessingLocation, setIsProcessingLocation] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.interests.length > 0) {
        setInterests(userProfile.interests.join(', '));
      }
      // Assuming userProfile.organization might sometimes contain a location.
      // For a more robust solution, userProfile should have a dedicated location field.
      // For now, if the main location input is empty, we could try pre-filling it.
      // This part is commented out as userProfile.organization is not a reliable location source.
      // if (userProfile.organization && !location) {
      //   setLocation(userProfile.organization); // Or a more specific location field if added to UserProfile
      // }
    }
  }, [userProfile]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingLocation(true);
    setLocation(''); // Clear previous location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode using OpenStreetMap Nominatim
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) {
            throw new Error('Failed to fetch address from coordinates.');
          }
          const data = await response.json();
          
          let city = data.address?.city || data.address?.town || data.address?.village || '';
          let state = data.address?.state || data.address?.county || '';
          
          if (city && state) {
            setLocation(`${city}, ${state}`);
            toast({
              title: "Location Fetched",
              description: `Your location has been set to ${city}, ${state}.`,
            });
          } else if (city) {
             setLocation(city);
             toast({
              title: "Location Fetched",
              description: `Your location has been set to ${city}.`,
            });
          } else {
            setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`); // Fallback to coords
            toast({
              title: "Location Partially Fetched",
              description: "Using coordinates as city/state could not be determined.",
              variant: "default",
            });
          }
        } catch (geoError) {
          console.error("Reverse geocoding error:", geoError);
          setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`); // Fallback
          toast({
            title: "Reverse Geocoding Error",
            description: "Could not determine city/state. Using coordinates.",
            variant: "destructive",
          });
        } finally {
          setIsProcessingLocation(false);
        }
      },
      (error) => {
        setIsProcessingLocation(false);
        let errorMessage = "Could not fetch your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enable it in your browser settings.";
        }
        toast({
          title: "Geolocation Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    );
  };

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
    setIsLoadingSuggestions(true);
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
      setIsLoadingSuggestions(false);
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
          {userProfile && userProfile.interests.length > 0 
            ? "Refine your interests or location to get updated suggestions."
            : "Tell us your interests and location to discover communities and events tailored for you."}
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
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY or click button"
                className="flex-grow"
                disabled={isProcessingLocation}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleUseCurrentLocation} 
                disabled={isProcessingLocation}
                className="shrink-0"
              >
                {isProcessingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Use My Location
              </Button>
            </div>
             <p className="text-xs text-muted-foreground mt-1">Enter city/state or use current location.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoadingSuggestions || isProcessingLocation} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoadingSuggestions ? (
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
