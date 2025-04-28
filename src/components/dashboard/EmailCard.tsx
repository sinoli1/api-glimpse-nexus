
import React from 'react';
import DashboardCard from './DashboardCard';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
  const failedEmails = Object.entries(emails)
    .filter(([_, email]) => email.Estado.toLowerCase() === 'failed')
    .map(([id, email]) => ({
      id,
      ...email
    }));
  
  return (
    <DashboardCard 
      title={title}
      description={`${failedEmails.length} failed emails`}
      className={cn('h-full', className)}
    >
      <div className="space-y-3">
        {failedEmails.length > 0 ? (
          failedEmails.map((email) => (
            <div 
              key={email.id}
              className="flex flex-col p-3 bg-secondary/50 rounded-md"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium truncate">{email.id}</span>
                <StatusBadge status={email.Estado} />
              </div>
              <div className="flex flex-col mb-2 text-xs text-muted-foreground">
                <span className="truncate">From: {email.Remitente}</span>
                <span className="truncate">To: {email.Destinatario}</span>
                <span className="truncate">Sent: {email.FechaEnvio}</span>
              </div>
              {email.Cuerpo && (
                <div className="mt-1 p-2 bg-black/5 rounded text-xs">
                  <div className="font-medium mb-1">Error details:</div>
                  <div className="whitespace-pre-wrap">{email.Cuerpo}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No failed emails
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default EmailCard;
