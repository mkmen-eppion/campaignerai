'use server';
/**
 * @fileOverview Generates a video plan (storyboard) from images and a script, tailored for YouTube ad formats.
 *
 * - generateVideoPlanFromImages - A function that creates a video plan.
 * - GenerateVideoPlanFromImagesInput - The input type.
 * - GenerateVideoPlanFromImagesOutput - The return type (video plan).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const YouTubeAdFormatSchema = z.enum([
  'SkippableInStream',    // Plays before, during, or after videos. Skippable after 5s. Rec <3min.
  'NonSkippableInStream', // 15-30s (region dependent). Not skippable.
  'InFeed',               // Thumbnail + text. Appears in search, Watch Next, Home.
  'Bumper',               // Max 6s. Non-skippable.
  'Outstream',            // Mobile-only, on partner sites/apps.
  'Masthead',             // Prominently on YouTube Home feed.
  'Shorts',               // Vertical video for YouTube Shorts feed.
]);
export type YouTubeAdFormat = z.infer<typeof YouTubeAdFormatSchema>;

export const GenerateVideoPlanFromImagesInputSchema = z.object({
  imageUrls: z.array(z.string().url().describe("Data URIs of base images for the video. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")).min(1).describe('At least one image URL is required.'),
  script: z.string().min(10).describe('The original script to guide video narrative and text overlays.'),
  youtubeAdFormat: YouTubeAdFormatSchema.describe("Desired YouTube Ad format to guide aspect ratio, length, structure, etc."),
  videoStylePrompt: z.string().optional().describe("Additional user prompts to refine video style (e.g., 'upbeat and energetic', 'calm and informative', 'focus on the product in use')."),
  targetDurationSeconds: z.number().int().positive().optional().describe('Approximate target duration for the video in seconds (e.g., 15, 30, 60).'),
  brandName: z.string().optional().describe("Brand name to include in the video, if applicable."),
  callToAction: z.string().optional().describe("Specific call to action to include (e.g., 'Shop Now', 'Learn More')."),
});
export type GenerateVideoPlanFromImagesInput = z.infer<typeof GenerateVideoPlanFromImagesInputSchema>;

const SceneSchema = z.object({
  sceneNumber: z.number().int().positive().describe('Sequential number of the scene.'),
  visualDescription: z.string().describe("Description of visuals for this scene. Reference input images (e.g., 'Use Image 1 showing the product packaging') or describe new visuals if appropriate."),
  audioElement: z.string().describe("Voiceover segment from the script, music description (e.g., 'upbeat electronic music'), or sound effects for this scene."),
  textOverlay: z.string().optional().describe("Text to display on screen (e.g., product name, key benefit, call to action)."),
  durationSeconds: z.number().positive().describe('Approximate duration of this scene in seconds.'),
  adFormatComplianceNotes: z.string().optional().describe("Notes on how this scene/element complies with the selected YouTube ad format guidelines (e.g., 'Crucial hook for first 5s of Skippable Ad', 'Clear branding for Bumper Ad')."),
});

export const GenerateVideoPlanFromImagesOutputSchema = z.object({
  videoPlan: z.object({
    title: z.string().describe("A suggested title for the video ad."),
    formatUsed: YouTubeAdFormatSchema.describe("The YouTube ad format this plan is designed for."),
    storyboard: z.array(SceneSchema).min(1).describe('A list of scenes detailing the video structure.'),
    overallStyle: z.string().describe('Overall style and tone of the video as planned.'),
    estimatedTotalDuration: z.number().positive().describe('Estimated total duration of the video plan in seconds.'),
    suggestionsForImprovement: z.string().optional().describe("Suggestions for how the user could further refine or improve the video ad based on the plan.")
  }).describe("The detailed plan for the video ad."),
});
export type GenerateVideoPlanFromImagesOutput = z.infer<typeof GenerateVideoPlanFromImagesOutputSchema>;

export async function generateVideoPlanFromImages(input: GenerateVideoPlanFromImagesInput): Promise<GenerateVideoPlanFromImagesOutput> {
  return generateVideoPlanFromImagesFlow(input);
}

const videoPlanPrompt = ai.definePrompt({
  name: 'generateVideoPlanFromImagesPrompt',
  input: {schema: GenerateVideoPlanFromImagesInputSchema},
  output: {schema: GenerateVideoPlanFromImagesOutputSchema},
  prompt: `You are an expert YouTube Video Ad producer. Your task is to create a detailed video plan (storyboard) based on the provided script, images, and desired ad format.

**Input Details:**
- **Script:** {{{script}}}
- **Number of Provided Images:** {{imageUrls.length}} (Refer to them as "Image 1", "Image 2", etc. in your visual descriptions)
- **Desired YouTube Ad Format:** {{{youtubeAdFormat}}}
{{#if videoStylePrompt}}- **Specific Style Prompt:** {{{videoStylePrompt}}}{{/if}}
{{#if targetDurationSeconds}}- **Target Duration:** {{{targetDurationSeconds}}} seconds{{/if}}
{{#if brandName}}- **Brand Name:** {{{brandName}}}{{/if}}
{{#if callToAction}}- **Call To Action:** {{{callToAction}}}{{/if}}

**Your Goal:** Generate a comprehensive video plan.

**Key Considerations based on YouTube Ad Formats:**
- **SkippableInStream:** Hook viewers in the first 5 seconds. Clear CTA. Branding prominent. Recommended under 3 minutes.
- **NonSkippableInStream:** 15-30 seconds. Must be impactful and concise. Strong branding.
- **InFeed:** Video itself should be engaging. Plan should note how it complements a thumbnail/headline (though you don't create those).
- **Bumper:** Maximum 6 seconds. Single, clear message. Memorable and impactful. Strong visual and branding.
- **Outstream:** Mobile-first. Consider sound-off viewing initially.
- **Masthead:** High visibility. Premium look and feel. Strong call to action.
- **Shorts:** Vertical format (e.g., 9:16). Fast-paced, engaging, often sound-on culture but plan for sound-off discovery.

**Video Plan Structure (Output):**
For each scene in the storyboard, provide:
1.  **sceneNumber:** Sequential number.
2.  **visualDescription:** How to use the provided images (e.g., "Image 1: Close-up of AuraBloom serum bottle") or describe new dynamic shots.
3.  **audioElement:** Relevant voiceover from script, music type, sound effects.
4.  **textOverlay:** Any text on screen (product name, benefits, CTA).
5.  **durationSeconds:** Estimated duration for this scene.
6.  **adFormatComplianceNotes:** Briefly explain how this scene adheres to {{{youtubeAdFormat}}} guidelines.

The overall plan should also include a title, the format used, overall style, estimated total duration, and suggestions for improvement.

**Example Visual Description:** "Image 2: Lifestyle shot of a person smiling, skin glowing. Pan slightly."
**Example Ad Format Note (for Bumper):** "Quick product shot, display brand name clearly."

Carefully consider the script, images, and the specific requirements of the "{{{youtubeAdFormat}}}" format to create an effective and compliant video ad plan. The images provided are:
{{#each imageUrls}}
- Image {{add @index 1}}: (Conceptually, this is where an image would be if the model could see it. Describe its use based on the script and context.)
{{/each}}
Use these images as the primary visual assets.
`,
  helpers: {
    add: (a: number, b: number) => a + b,
  }
});

const generateVideoPlanFromImagesFlow = ai.defineFlow(
  {
    name: 'generateVideoPlanFromImagesFlow',
    inputSchema: GenerateVideoPlanFromImagesInputSchema,
    outputSchema: GenerateVideoPlanFromImagesOutputSchema,
  },
  async (input) => {
    // The prompt will receive image URLs, but the LLM can't "see" them directly in this text-only generation.
    // The prompt guides the LLM to use the *concept* of these images.
    // If a multimodal model that can take images as direct input for text generation is used,
    // the prompt could be {{#each imageUrls}} {{media url=this}} {{/each}}, but for gemini-2.0-flash text output,
    // describing their existence and count is more practical.
    
    const {output} = await videoPlanPrompt(input);
    if (!output) {
      throw new Error('Video plan generation failed to produce an output.');
    }
    return output;
  }
);
