
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';

interface EmailProps {
  Remitente: string;
  Destinatario: string;
  FechaEnvio: string;
  Estado: string;
  Cuerpo: string;
}

interface EmailCardProps {
  title: string;
  emails: Record<string, EmailProps>;
  className?: string;
}

const EmailCard: React.FC<EmailCardProps> = ({ title, emails, className }) => {
  const emailsArray = Object.entries(emails).map(([id, email]) => ({
    id,
    ...email
  }));
  
  return (
    <DashboardCard 
      title={title}
      description={`${emailsArray.length} recent emails`}
      className={cn('h-full', className)}
    >
      <div className="space-y-3">
        {emailsArray.map((email) => (
          <div 
            key={email.id}
            className="flex justify-between p-3 bg-secondary/50 rounded-md"
          >
            <div className="flex flex-col flex-grow mr-2">
              <span className="font-medium truncate">{email.id}</span>
              <div className="flex flex-col text-xs text-muted-foreground">
                <span className="truncate">From: {email.Remitente}</span>
                <span className="truncate">To: {email.Destinatario}</span>
                <span className="truncate">Sent: {email.FechaEnvio}</span>
              </div>
            </div>
            <StatusBadge status={email.Estado} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default EmailCard;
