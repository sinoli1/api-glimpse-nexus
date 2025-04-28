
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'glass' | 'outlined';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  className,
  children,
  footer,
  variant = 'default'
}) => {
  return (
    <Card className={cn(
      'overflow-hidden',
      variant === 'glass' && 'glass-card',
      variant === 'outlined' && 'border-2',
      className
    )}>
      <CardHeader className={cn('pb-2', variant === 'glass' && 'glass-card')}>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && <CardFooter className="pt-2">{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;
