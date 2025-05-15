'use client';

import type React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Copy, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ContentDisplayCardProps {
  title: string;
  icon?: React.ReactNode;
  content: string | string[] | null;
  isLoading: boolean;
  error?: string | null;
  contentType?: 'markdown' | 'text-list' | 'text';
}

export function ContentDisplayCard({ title, icon, content, isLoading, error, contentType = 'text' }: ContentDisplayCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (!content) return;
    const contentToCopy = Array.isArray(content) ? content.join('\n\n---\n\n') : content;
    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        toast({ title: 'Copied to clipboard!', description: `${title} content has been copied.` });
      })
      .catch(err => {
        toast({ variant: 'destructive', title: 'Copy failed', description: 'Could not copy content to clipboard.' });
        console.error('Failed to copy: ', err);
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Generating content...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Content</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!content || (Array.isArray(content) && content.length === 0)) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>No content generated yet. Fill out the form and click generate.</p>
        </div>
      );
    }

    if (contentType === 'markdown' || contentType === 'text') {
      return <pre className="whitespace-pre-wrap break-words text-sm p-1">{typeof content === 'string' ? content : ''}</pre>;
    }

    if (contentType === 'text-list' && Array.isArray(content)) {
      return (
        <ul className="space-y-4">
          {content.map((item, index) => (
            <li key={index} className="p-3 border rounded-md bg-secondary/30">
              <pre className="whitespace-pre-wrap break-words text-sm">{item}</pre>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </div>
        {content && !isLoading && !error && (
          <Button variant="ghost" size="sm" onClick={handleCopy} aria-label={`Copy ${title}`}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] md:h-[500px] w-full rounded-md border p-4">
          {renderContent()}
        </ScrollArea>
      </CardContent>
      { (contentType === 'text-list' && Array.isArray(content) && content.length > 0) &&
        <CardFooter>
            <CardDescription>Generated {content.length} posts.</CardDescription>
        </CardFooter>
      }
    </Card>
  );
}
