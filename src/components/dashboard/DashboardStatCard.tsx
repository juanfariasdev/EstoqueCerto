
'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  linkHref: string;
  linkText: string;
}

export default function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  linkHref,
  linkText,
}: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-muted-foreground ${iconClassName}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link href={linkHref} className="text-sm text-primary hover:underline mt-2 block">
          {linkText}
        </Link>
      </CardContent>
    </Card>
  );
}
