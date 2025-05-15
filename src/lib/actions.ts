'use server';

import { generateBlogContent, type GenerateBlogContentInput, type GenerateBlogContentOutput } from '@/ai/flows/generate-blog-content';
import { generateSocialMediaPosts, type GenerateSocialMediaPostsInput, type GenerateSocialMediaPostsOutput } from '@/ai/flows/generate-social-media-posts';

export async function handleGenerateBlogContent(input: GenerateBlogContentInput): Promise<GenerateBlogContentOutput> {
  try {
    const result = await generateBlogContent(input);
    return result;
  } catch (error) {
    console.error('Error generating blog content:', error);
    throw new Error('Failed to generate blog content. Please try again.');
  }
}

export async function handleGenerateSocialMediaPosts(input: GenerateSocialMediaPostsInput): Promise<GenerateSocialMediaPostsOutput> {
  try {
    const result = await generateSocialMediaPosts(input);
    return result;
  } catch (error) {
    console.error('Error generating social media posts:', error);
    throw new Error('Failed to generate social media posts. Please try again.');
  }
}
