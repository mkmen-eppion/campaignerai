'use server';
/**
 * @fileOverview Generates images based on a provided script.
 *
 * - generateImagesFromScript - A function that generates images from a script.
 * - GenerateImagesFromScriptInput - The input type for the generateImagesFromScript function.
 * - GenerateImagesFromScriptOutput - The return type for the generateImagesFromScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateImagesFromScriptInputSchema = z.object({
  script: z.string().min(10).describe('The text script to generate images from.'),
  numberOfImages: z.number().int().min(1).max(5).optional().default(1).describe('The number of distinct images to generate (1-5).'),
});
export type GenerateImagesFromScriptInput = z.infer<typeof GenerateImagesFromScriptInputSchema>;

export const GenerateImagesFromScriptOutputSchema = z.object({
  imageUrls: z.array(z.string().url().describe("Array of data URIs for the generated images. Each URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")).describe('An array of generated image data URIs.'),
});
export type GenerateImagesFromScriptOutput = z.infer<typeof GenerateImagesFromScriptOutputSchema>;

export async function generateImagesFromScript(input: GenerateImagesFromScriptInput): Promise<GenerateImagesFromScriptOutput> {
  return generateImagesFromScriptFlow(input);
}

const generateImagesPrompt = ai.definePrompt({
  name: 'generateImagesFromScriptPrompt',
  input: {schema: GenerateImagesFromScriptInputSchema},
  // Output schema is not strictly enforced by the model for media, but good for documentation
  // The actual output processing will ensure the format.
  prompt: `You are an AI image generation assistant. Based on the following script, generate {{{numberOfImages}}} distinct, high-quality images that visually represent the key themes, products, or emotions described.

Script:
{{{script}}}

Ensure the generated images are compelling and suitable for marketing purposes.
`,
});

const generateImagesFromScriptFlow = ai.defineFlow(
  {
    name: 'generateImagesFromScriptFlow',
    inputSchema: GenerateImagesFromScriptInputSchema,
    outputSchema: GenerateImagesFromScriptOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      prompt: () => generateImagesPrompt(input), // Pass input to the prompt function
      // IMPORTANT: Only gemini-2.0-flash-exp (or newer vision models) can generate images.
      model: 'googleai/gemini-2.0-flash-exp',
      config: {
        responseModalities: ['IMAGE'], // Request only IMAGE modality
        // You can adjust safetySettings if needed, e.g.:
        // safetySettings: [{ category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' }],
      },
    });
    
    const imageUrls = media.map(m => m.url).filter((url): url is string => !!url);

    if (imageUrls.length === 0) {
      throw new Error('Image generation failed or returned no images.');
    }
    
    return { imageUrls };
  }
);
