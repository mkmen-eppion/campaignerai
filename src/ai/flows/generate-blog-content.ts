// use server'

/**
 * @fileOverview Blog content generation flow.
 *
 * - generateBlogContent - A function that generates blog content based on user inputs.
 * - GenerateBlogContentInput - The input type for the generateBlogContent function.
 * - GenerateBlogContentOutput - The return type for the generateBlogContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogContentInputSchema = z.object({
  product: z.string().describe('The name of the product or service.'),
  audience: z.string().describe('The target audience for the blog post.'),
  message: z.string().describe('The key message to convey in the blog post.'),
  longFormDetails: z.string().describe('Detailed information and context for the blog post.'),
  quotesStats: z.string().optional().describe('Optional quotes or statistics to support the message.'),
  referenceUrls: z.string().optional().describe('Optional reference URLs for additional information.'),
});
export type GenerateBlogContentInput = z.infer<typeof GenerateBlogContentInputSchema>;

const GenerateBlogContentOutputSchema = z.object({
  blogContent: z.string().describe('The generated long-form blog content.'),
});
export type GenerateBlogContentOutput = z.infer<typeof GenerateBlogContentOutputSchema>;

export async function generateBlogContent(input: GenerateBlogContentInput): Promise<GenerateBlogContentOutput> {
  return generateBlogContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogContentPrompt',
  input: {schema: GenerateBlogContentInputSchema},
  output: {schema: GenerateBlogContentOutputSchema},
  prompt: `You are a skilled blog writer who specializes in creating engaging and informative content.

  Based on the following information, generate a long-form blog post that effectively communicates the key message.

  Product/Service: {{{product}}}
  Target Audience: {{{audience}}}
  Key Message: {{{message}}}
  Detailed Information: {{{longFormDetails}}}

  {{#if quotesStats}}
  Supporting Quotes/Stats: {{{quotesStats}}}
  Reason about when it is appropriate to include the quotes or statistics.
  {{/if}}

  {{#if referenceUrls}}
  Reference URLs: {{{referenceUrls}}}
  Reason about when it is appropriate to include the reference URLs.
  {{/if}}

  Write a compelling and comprehensive blog post that resonates with the target audience and clearly conveys the key message. Be sure to use markdown.
  `,
});

const generateBlogContentFlow = ai.defineFlow(
  {
    name: 'generateBlogContentFlow',
    inputSchema: GenerateBlogContentInputSchema,
    outputSchema: GenerateBlogContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
