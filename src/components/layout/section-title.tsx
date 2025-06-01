import type React from 'react';

interface SectionTitleProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ icon, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 font-headline">
        {icon}
        {title}
      </h2>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
