'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogGeneratorForm } from '@/components/forms/BlogGeneratorForm';
import { SocialMediaGeneratorForm } from '@/components/forms/SocialMediaGeneratorForm';
import { ContentDisplayCard } from '@/components/display/ContentDisplayCard';
import { ImportExportControls } from '@/components/core/ImportExportControls';
import type { BlogGeneratorFormValues, SocialMediaGeneratorFormValues } from '@/lib/schemas';
import { Newspaper, Share2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogGeneratorSchema, SocialMediaGeneratorSchema } from '@/lib/schemas';


export default function MarketPlanAIPage() {
  const [generatedBlogContent, setGeneratedBlogContent] = useState<string | null>(null);
  const [blogContentError, setBlogContentError] = useState<string | null>(null);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  const [generatedSocialPosts, setGeneratedSocialPosts] = useState<string[] | null>(null);
  const [socialPostsError, setSocialPostsError] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  // Form instances for ImportExportControls
  const blogFormMethods = useForm<BlogGeneratorFormValues>({
    resolver: zodResolver(BlogGeneratorSchema),
    defaultValues: { product: '', audience: '', message: '', longFormDetails: '', quotesStats: '', referenceUrls: '' },
  });
  const socialMediaFormMethods = useForm<SocialMediaGeneratorFormValues>({
    resolver: zodResolver(SocialMediaGeneratorSchema),
    defaultValues: { productInformation: '', targetAudience: '', keyMessage: '', socialPlatform: undefined, callToAction: '', formatConstraints: '' },
  });
  
  const [blogInputs, setBlogInputs] = useState<Partial<BlogGeneratorFormValues>>({});
  const [socialMediaInputs, setSocialMediaInputs] = useState<Partial<SocialMediaGeneratorFormValues>>({});

  useEffect(() => {
    const subscription = blogFormMethods.watch((value) => {
      setBlogInputs(value as Partial<BlogGeneratorFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [blogFormMethods]);

  useEffect(() => {
    const subscription = socialMediaFormMethods.watch((value) => {
      setSocialMediaInputs(value as Partial<SocialMediaGeneratorFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [socialMediaFormMethods]);


  const handleBlogContentGenerated = (content: string | null, error?: string | null) => {
    setGeneratedBlogContent(content);
    setBlogContentError(error || null);
  };

  const handleSocialMediaPostsGenerated = (posts: string[] | null, error?: string | null) => {
    setGeneratedSocialPosts(posts);
    setSocialPostsError(error || null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader 
        importExportControls={
          <ImportExportControls 
            blogInputs={blogInputs}
            socialMediaInputs={socialMediaInputs}
            blogOutput={generatedBlogContent}
            socialMediaOutput={generatedSocialPosts}
          />
        }
      />
      <div className="container mx-auto flex-1 p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Input Forms */}
          <div className="lg:w-2/5 space-y-6">
            <Tabs defaultValue="blog" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="blog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Newspaper className="mr-2 h-4 w-4" /> Blog Content
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Share2 className="mr-2 h-4 w-4" /> Social Media
                </TabsTrigger>
              </TabsList>
              <TabsContent value="blog" className="mt-6">
                <FormProvider {...blogFormMethods}>
                  <BlogGeneratorForm
                    onBlogContentGenerated={handleBlogContentGenerated}
                    setIsLoading={setIsBlogLoading}
                    isLoading={isBlogLoading}
                    initialValues={blogInputs}
                  />
                </FormProvider>
              </TabsContent>
              <TabsContent value="social" className="mt-6">
                 <FormProvider {...socialMediaFormMethods}>
                    <SocialMediaGeneratorForm
                        onSocialMediaPostsGenerated={handleSocialMediaPostsGenerated}
                        setIsLoading={setIsSocialLoading}
                        isLoading={isSocialLoading}
                        initialValues={socialMediaInputs}
                    />
                 </FormProvider>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Content Display */}
          <div className="lg:w-3/5 space-y-8">
            <ContentDisplayCard
              title="Generated Blog Content"
              icon={<Newspaper className="h-5 w-5 text-primary" />}
              content={generatedBlogContent}
              isLoading={isBlogLoading}
              error={blogContentError}
              contentType="markdown"
            />
            <ContentDisplayCard
              title="Generated Social Media Posts"
              icon={<Share2 className="h-5 w-5 text-primary" />}
              content={generatedSocialPosts}
              isLoading={isSocialLoading}
              error={socialPostsError}
              contentType="text-list"
            />
          </div>
        </div>
      </div>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built with Next.js, ShadCN UI, and Genkit.
          </p>
        </div>
      </footer>
    </div>
  );
}
