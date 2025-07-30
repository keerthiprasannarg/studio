// Implemented the suggestReplies flow with input and output schemas, along with a prompt to generate smart reply suggestions.

'use server';

/**
 * @fileOverview A smart reply suggestion AI agent.
 * 
 * - suggestReplies - A function that generates smart reply suggestions.
 * - SuggestRepliesInput - The input type for the suggestReplies function.
 * - SuggestRepliesOutput - The return type for the suggestReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRepliesInputSchema = z.object({
  message: z.string().describe('The latest message received from the user.'),
});
export type SuggestRepliesInput = z.infer<typeof SuggestRepliesInputSchema>;

const SuggestRepliesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested replies based on the input message.'),
});
export type SuggestRepliesOutput = z.infer<typeof SuggestRepliesOutputSchema>;

export async function suggestReplies(input: SuggestRepliesInput): Promise<SuggestRepliesOutput> {
  return suggestRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRepliesPrompt',
  input: {schema: SuggestRepliesInputSchema},
  output: {schema: SuggestRepliesOutputSchema},
  prompt: `You are a helpful assistant that suggests replies to a given message.

  Generate three suggested replies that would be appropriate for the following message:

  Message: {{{message}}}

  Your suggestions should be short and common phrases that a user would use in response to the message.  Return the suggestions as a JSON array of strings.
  `,
});

const suggestRepliesFlow = ai.defineFlow(
  {
    name: 'suggestRepliesFlow',
    inputSchema: SuggestRepliesInputSchema,
    outputSchema: SuggestRepliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
