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
      productInformation: '',
      targetAudience: '',
      keyMessage: '',
      socialPlatform: undefined,
      callToAction: '',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="productInformation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Information</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Detailed information about the product or service." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Young professionals aged 25-35" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keyMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Message</FormLabel>
              <FormControl>
                <Textarea placeholder="The core message to be conveyed." {...field} />
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
          name="callToAction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call To Action (CTA)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Visit our website, Learn more, Shop now" {...field} />
              </FormControl>
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
                <Input placeholder="e.g., Max 280 characters for Twitter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Social Media Posts
        </Button>
      </form>
    </Form>
  );
}
