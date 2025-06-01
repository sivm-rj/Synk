
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

const discussionFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  // community: z.string().optional(), // Add later if needed
});

type DiscussionFormValues = z.infer<typeof discussionFormSchema>;

interface CreateDiscussionFormProps {
  children: React.ReactNode; // Trigger element
}

export function CreateDiscussionForm({ children }: CreateDiscussionFormProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<DiscussionFormValues>({
    resolver: zodResolver(discussionFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function onSubmit(data: DiscussionFormValues) {
    console.log('New Discussion Data:', data);
    // Here you would typically send data to your backend to create a new forum thread
    toast({
      title: 'Discussion Started!',
      description: `Your discussion "${data.title}" has been logged.`,
    });
    form.reset();
    setOpen(false); // Close the dialog
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Start New Discussion
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new discussion thread. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discussion Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., What's your favorite tech podcast?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your thoughts, questions, or ideas..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 
            // Optional: Add community selection later
            <FormField
              control={form.control}
              name="community"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post in Community (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech Enthusiasts Group" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 
            */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Posting...' : 'Post Discussion'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
