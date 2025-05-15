import { z } from 'zod';

export const BlogGeneratorSchema = z.object({
  product: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  audience: z.string().min(3, { message: 'Target audience must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Key message must be at least 10 characters.' }),
  longFormDetails: z.string().min(20, { message: 'Detailed information must be at least 20 characters.' }),
  quotesStats: z.string().optional(),
  referenceUrls: z.string().optional(),
});
export type BlogGeneratorFormValues = z.infer<typeof BlogGeneratorSchema>;

export const socialPlatforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'] as const;

export const SocialMediaGeneratorSchema = z.object({
  product: z.object({
    name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
    one_line_description: z.string().min(10, { message: 'One-line description must be at least 10 characters.' }),
    problem_solved: z.string().min(10, { message: 'Problem solved description must be at least 10 characters.' }),
    benefits: z.array(z.string().min(5, { message: 'Each benefit must be at least 5 characters.' }))
                .min(1, { message: 'Please list at least one benefit.' })
                .max(5, { message: 'Please list no more than 5 benefits.' }), // Added a max for benefits as an example
    differentiator: z.string().min(10, { message: 'Differentiator description must be at least 10 characters.' }),
  }),
  audience: z.object({
    target: z.string().min(3, { message: 'Target audience must be at least 3 characters.' }), // Migrated from old targetAudience
    desired_action: z.string().min(5, { message: 'Desired action (call to action) must be at least 5 characters.' }), // Migrated from old callToAction
    emotion_to_trigger: z.string().min(3, { message: 'Emotion to trigger must be at least 3 characters.' }),
  }),
  keyMessage: z.string().min(10, { message: 'Key message must be at least 10 characters.' }), // Retained from old schema
  socialPlatform: z.enum(socialPlatforms, {
    required_error: 'Please select a social platform.',
    invalid_type_error: "That's not a valid social platform", // Example of another error message
  }), // Retained from old schema
  formatConstraints: z.string().optional(), // Retained from old schema
});

export type SocialMediaGeneratorFormValues = z.infer<typeof SocialMediaGeneratorSchema>;
