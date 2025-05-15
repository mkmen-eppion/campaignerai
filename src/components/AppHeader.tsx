import { BrainCircuit } from 'lucide-react';
import type React from 'react';

interface AppHeaderProps {
  importExportControls?: React.ReactNode;
}

export function AppHeader({ importExportControls }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">MarketPlanAI</h1>
        </div>
        {importExportControls && <div>{importExportControls}</div>}
      </div>
    </header>
  );
}
