'use client';

import type React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialMediaGeneratorSchema, type SocialMediaGeneratorFormValues, socialPlatforms } from '@/lib/schemas';
import { handleGenerateSocialMediaPosts } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SocialMediaGeneratorFormProps {
  onSocialMediaPostsGenerated: (posts: string[] | null, error?: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  initialValues?: Partial<SocialMediaGeneratorFormValues>;
}

export function SocialMediaGeneratorForm({ onSocialMediaPostsGenerated, setIsLoading, isLoading, initialValues }: SocialMediaGeneratorFormProps) {
  const { toast } = useToast();
  const form = useForm<SocialMediaGeneratorFormValues>({
    resolver: zodResolver(SocialMediaGeneratorSchema),
    defaultValues: initialValues || {
      product: {
        name: '',
        one_line_description: '',
        problem_solved: '',
        benefits: [], // Default for an array of strings is an empty array
        differentiator: '',
      },
      audience: {
        target: '', // Previously targetAudience
        desired_action: '', // Previously callToAction
        emotion_to_trigger: '',
      },
      keyMessage: '',
      socialPlatform: undefined, // Or a specific default like 'Facebook' if that makes sense for your UX
      formatConstraints: '',
    },
  });

  async function onSubmit(data: SocialMediaGeneratorFormValues) {
    setIsLoading(true);
    onSocialMediaPostsGenerated(null, null); // Clear previous results/errors
    try {
      const result = await handleGenerateSocialMediaPosts(data);
      onSocialMediaPostsGenerated(result.posts);
      toast({ title: 'Success!', description: 'Social media posts generated.' });
    } catch (e) {
      const error = e as Error;
      onSocialMediaPostsGenerated(null, error.message);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> {/* Increased space-y for more fields */}
        {/* Product Fields */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Product/Service Details</h3>
          <FormField
            control={form.control}
            name="product.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product/Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AI Writing Assistant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product.one_line_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-line Description</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="A concise description of the product/service." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product.problem_solved"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Solved</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="What problem does this product/service solve for the user?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         <FormField
            control={form.control}
            name="product.benefits" // field.value will be an array of strings here
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Benefits</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="List key benefits (e.g., saves time, increases productivity). Enter each benefit on a new line or separated by commas."
                    // Explicitly pass down react-hook-form's props that Textarea can use directly or that RHF needs
                    name={field.name}
                    onBlur={field.onBlur} // For validation triggers
                    ref={field.ref}       // For RHF to connect to the input element

                    // Convert the array to a string for display in the Textarea
                    // Join by ", " for a nice display. If field.value is undefined or not an array, default to an empty string.
                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                    
                    // When the Textarea value changes, parse the input string into an array of strings
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const inputText = e.target.value;
                      // Split the string by commas or newlines
                      // Then, trim whitespace from each part
                      // Finally, filter out any empty strings that might result from multiple commas/newlines or trailing ones
                      const benefitsArray = inputText
                        .split(/,|\n/) // Split by comma OR newline
                        .map(s => s.trim())
                        .filter(s => s); // Removes empty strings (e.g., from "apple,,banana" or "apple\n\nbanana")
                      
                      // Update the form state with the new array of benefits
                      field.onChange(benefitsArray);
                    }}
                  />
                </FormControl>
                <FormMessage /> {/* Displays validation messages for product.benefits */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product.differentiator"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Differentiator</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="What makes this product/service unique compared to competitors?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Audience Fields */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Audience Details</h3>
          <FormField
            control={form.control}
            name="audience.target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Young professionals aged 25-35, small business owners" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audience.desired_action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Action (CTA)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Visit our website, Sign up for a demo, Learn more" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audience.emotion_to_trigger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emotion to Trigger</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Excitement, curiosity, sense of urgency" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Core Message & Platform Fields */}
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Content Strategy</h3>
          <FormField
            control={form.control}
            name="keyMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="The core message to be conveyed in the posts." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="socialPlatform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Media Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {socialPlatforms.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formatConstraints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format Constraints (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Max 280 characters for Twitter, include 3 hashtags" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Social Media Posts
        </Button>
      </form>
    </Form>
  );
}
