'use server';
/**
 * @fileOverview Provides community and event suggestions based on user profile information and preferences.
 *
 * - suggestCommunitiesAndEvents - A function that takes user profile information and preferences as input and returns a list of suggested communities and events.
 * - SuggestCommunitiesAndEventsInput - The input type for the suggestCommunitiesAndEvents function.
 * - SuggestCommunitiesAndEventsOutput - The return type for the suggestCommunitiesAndEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCommunitiesAndEventsInputSchema = z.object({
  interests: z
    .string()
    .describe('A comma-separated list of the user interests e.g., coding, hiking, photography'),
  location: z.string().describe('The current location of the user (city, state).'),
  pastEvents: z
    .string()
    .optional()
    .describe('A comma-separated list of past events the user has attended.'),
  groups: z
    .string()
    .optional()
    .describe(
      'A comma-separated list of groups or communities the user is already a member of.'
    ),
});
export type SuggestCommunitiesAndEventsInput = z.infer<
  typeof SuggestCommunitiesAndEventsInputSchema
>;

const SuggestCommunitiesAndEventsOutputSchema = z.object({
  suggestedCommunities: z
    .string()
    .describe('A comma-separated list of suggested communities based on the user interests.'),
  suggestedEvents: z
    .string()
    .describe('A comma-separated list of suggested events based on the user interests and location.'),
});
export type SuggestCommunitiesAndEventsOutput = z.infer<
  typeof SuggestCommunitiesAndEventsOutputSchema
>;

export async function suggestCommunitiesAndEvents(
  input: SuggestCommunitiesAndEventsInput
): Promise<SuggestCommunitiesAndEventsOutput> {
  return suggestCommunitiesAndEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCommunitiesAndEventsPrompt',
  input: {schema: SuggestCommunitiesAndEventsInputSchema},
  output: {schema: SuggestCommunitiesAndEventsOutputSchema},
  prompt: `You are a community and event recommendation expert. Given a user's interests, location, 
past events, and current groups, you will suggest relevant communities and events.

Interests: {{{interests}}}
Location: {{{location}}}
Past Events: {{{pastEvents}}}
Current Groups: {{{groups}}}

Based on this information, suggest communities and events that the user might be interested in.
Provide a list of suggested communities and a list of suggested events. Separate the items in the lists by comma.
`,
});

const suggestCommunitiesAndEventsFlow = ai.defineFlow(
  {
    name: 'suggestCommunitiesAndEventsFlow',
    inputSchema: SuggestCommunitiesAndEventsInputSchema,
    outputSchema: SuggestCommunitiesAndEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
