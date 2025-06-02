import React, { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, actions }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground font-headline">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
