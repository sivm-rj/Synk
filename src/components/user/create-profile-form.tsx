
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/types';
import { UserCircle, Image as ImageIcon, Briefcase, Info, Sparkles, CheckCircle, Users, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  avatarUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  organization: z.string().min(2, { message: 'Organization must be at least 2 characters.' }).optional().or(z.literal('')),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }).max(200, { message: 'Bio must be 200 characters or less.' }),
  interests: z.string().min(3, { message: 'Please list at least one interest.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function CreateProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestedCommunity, setSuggestedCommunity] = React.useState<string | null>(null);

  const defaultValues = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return {
        name: localStorage.getItem('userName') || '',
        avatarUrl: '',
        organization: '',
        bio: '',
        interests: '',
      };
    }
    return { name: '', avatarUrl: '', organization: '', bio: '', interests: '' };
  }, []);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);


  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const userEmail = localStorage.getItem('userEmail') || '';
    const newProfile: UserProfile = {
      id: userEmail, 
      name: data.name,
      avatarUrl: data.avatarUrl || 'https://placehold.co/200x200.png', 
      organization: data.organization || '',
      bio: data.bio,
      interests: data.interests.split(',').map(interest => interest.trim()).filter(interest => interest),
      isVerified: false, 
    };

    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    console.log('Profile Created/Updated:', newProfile);

    const emailDomain = userEmail.split('@')[1];
    if (emailDomain === 'google.com') {
      setSuggestedCommunity('Google Community');
    } else if (emailDomain === 'example.com') {
      setSuggestedCommunity('Example Org Community');
    } else {
      setSuggestedCommunity(null);
    }
    
    toast({
      title: 'Profile Saved!',
      description: 'Your profile has been successfully created/updated.',
    });
    
    if (suggestedCommunity && !isLoading) { // Check isLoading here to prevent premature redirect if suggestion is set before API call finishes (though unlikely with await)
        setIsLoading(false);
    } else {
        router.push('/');
        setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <UserCircle className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-bold font-headline">Complete Your Profile</CardTitle>
        <CardDescription>Tell us a bit more about yourself to get started on Synk.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormFieldItem name="name" label="Full Name" placeholder="Your full name" icon={<UserIcon className="h-4 w-4" />} form={form} />
          <FormFieldItem name="avatarUrl" label="Avatar URL (Optional)" placeholder="https://example.com/your-photo.png" icon={<ImageIcon className="h-4 w-4" />} form={form} type="url" />
          <FormFieldItem name="organization" label="Organization (Optional)" placeholder="e.g., State University, Tech Corp" icon={<Briefcase className="h-4 w-4" />} form={form} />
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <div className="relative">
              <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="bio"
                placeholder="Tell us about yourself in a few words..."
                {...form.register('bio')}
                className="pl-10"
              />
            </div>
            {form.formState.errors.bio && (
              <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
            )}
          </div>

          <FormFieldItem name="interests" label="Your Interests" placeholder="e.g., Coding, Hiking, Photography" icon={<Sparkles className="h-4 w-4" />} form={form} description="Separate interests with a comma." />

        </CardContent>
        <CardFooter className="flex-col items-stretch space-y-4">
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? (
              <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Save Profile
          </Button>

          {suggestedCommunity && !isLoading && ( // Ensure not loading when showing this
            <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-md text-center">
              <h3 className="text-md font-semibold flex items-center justify-center gap-2 text-primary mb-2 font-headline">
                <Users className="h-5 w-5" />
                Community Suggestion
              </h3>
              <p className="text-sm text-foreground">
                Based on your email, we suggest you might be interested in the <strong>{suggestedCommunity}</strong>!
              </p>
              <Button variant="link" className="mt-2" onClick={() => router.push('/')}>
                Continue to Synk
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

interface FormFieldItemProps {
  name: keyof ProfileFormValues;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  form: ReturnType<typeof useForm<ProfileFormValues>>;
  type?: string;
  description?: string;
}

function FormFieldItem({ name, label, placeholder, icon, form, type = "text", description }: FormFieldItemProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...form.register(name)}
          className="pl-10"
        />
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {form.formState.errors[name] && (
        <p className="text-xs text-destructive">{form.formState.errors[name]?.message}</p>
      )}
    </div>
  );
}
