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
  productInformation: z.string().min(10, { message: 'Product information must be at least 10 characters.' }),
  targetAudience: z.string().min(3, { message: 'Target audience must be at least 3 characters.' }),
  keyMessage: z.string().min(10, { message: 'Key message must be at least 10 characters.' }),
  socialPlatform: z.enum(socialPlatforms, { required_error: 'Please select a social platform.'}),
  callToAction: z.string().min(5, { message: 'Call to action must be at least 5 characters.' }),
  formatConstraints: z.string().optional(),
});
export type SocialMediaGeneratorFormValues = z.infer<typeof SocialMediaGeneratorSchema>;
