'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { BlogGeneratorFormValues, SocialMediaGeneratorFormValues } from "@/lib/schemas";

interface ImportExportControlsProps {
  blogInputs?: Partial<BlogGeneratorFormValues>;
  socialMediaInputs?: Partial<SocialMediaGeneratorFormValues>;
  blogOutput: string | null;
  socialMediaOutput: string[] | null;
}

export function ImportExportControls({
  blogInputs,
  socialMediaInputs,
  blogOutput,
  socialMediaOutput,
}: ImportExportControlsProps) {
  
  const handleExport = () => {
    const dataToExport = {
      inputs: {
        blogGenerator: blogInputs || {},
        socialMediaGenerator: socialMediaInputs || {},
      },
      outputs: {
        blogContent: blogOutput,
        socialMediaPosts: socialMediaOutput,
      },
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `marketplanai_export_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleExport} title="Export Data">
        <Download className="mr-2 h-4 w-4" />
        Export All Data
      </Button>
      {/* Import button can be added here later */}
    </div>
  );
}
