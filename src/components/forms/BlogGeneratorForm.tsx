'use client';

import type React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogGeneratorSchema, type BlogGeneratorFormValues } from '@/lib/schemas';
import { handleGenerateBlogContent } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface BlogGeneratorFormProps {
  onBlogContentGenerated: (content: string | null, error?: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  initialValues?: Partial<BlogGeneratorFormValues>;
}

export function BlogGeneratorForm({ onBlogContentGenerated, setIsLoading, isLoading, initialValues }: BlogGeneratorFormProps) {
  const { toast } = useToast();
  const form = useForm<BlogGeneratorFormValues>({
    resolver: zodResolver(BlogGeneratorSchema),
    defaultValues: initialValues || {
      product: '',
      audience: '',
      message: '',
      longFormDetails: '',
      quotesStats: '',
      referenceUrls: '',
    },
  });

  async function onSubmit(data: BlogGeneratorFormValues) {
    setIsLoading(true);
    onBlogContentGenerated(null, null); // Clear previous results/errors
    try {
      const result = await handleGenerateBlogContent(data);
      onBlogContentGenerated(result.blogContent);
      toast({ title: 'Success!', description: 'Blog content generated.' });
    } catch (e) {
      const error = e as Error;
      onBlogContentGenerated(null, error.message);
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
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., EcoClean Home Solutions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Environmentally conscious homeowners" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Message</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Discover sustainable cleaning with our new product line." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longFormDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Information & Context</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Provide comprehensive details about the product, its benefits, features, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quotesStats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting Quotes/Statistics (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., '9 out of 10 users reported a cleaner home.' - Dr. Eco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referenceUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference URLs (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://example.com/research" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Blog Content
        </Button>
      </form>
    </Form>
  );
}
