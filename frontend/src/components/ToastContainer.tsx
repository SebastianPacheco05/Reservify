import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.variant) {
            case 'success':
              return (
                <CheckCircle
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
              );
            case 'destructive':
              return (
                <XCircle
                  className="h-4 w-4 text-secondary"
                  aria-hidden="true"
                />
              );
            case 'warning':
              return (
                <AlertCircle
                  className="h-4 w-4 text-secondary"
                  aria-hidden="true"
                />
              );
            default:
              return (
                <Info
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
              );
          }
        };

        const getVariantClass = () => {
          // Estilo unificado con paleta naranja/rojo, manteniendo texto legible en light/dark
          switch (toast.variant) {
            case 'success':
              return [
                'border-primary/25',
                'bg-primary/10',
                'text-foreground',
                'backdrop-blur-md',
                'shadow-[0_0_22px_rgba(255,106,0,0.18)]',
                'dark:shadow-[0_0_30px_rgba(255,106,0,0.22)]',
              ].join(' ');
            case 'destructive':
              return [
                'border-secondary/30',
                'bg-secondary/10',
                'text-foreground',
                'backdrop-blur-md',
                'shadow-[0_0_22px_rgba(255,45,85,0.22)]',
                'dark:shadow-[0_0_30px_rgba(255,45,85,0.25)]',
              ].join(' ');
            case 'warning':
              return [
                'border-secondary/30',
                'bg-secondary/10',
                'text-foreground',
                'backdrop-blur-md',
                'shadow-[0_0_22px_rgba(255,45,85,0.18)]',
                'dark:shadow-[0_0_30px_rgba(255,45,85,0.22)]',
              ].join(' ');
            default:
              return [
                'border-primary/25',
                'bg-primary/10',
                'text-foreground',
                'backdrop-blur-md',
                'shadow-[0_0_20px_rgba(255,106,0,0.16)]',
                'dark:shadow-[0_0_28px_rgba(255,106,0,0.20)]',
              ].join(' ');
          }
        };

        return (
          <Alert
            key={toast.id}
            className={`${getVariantClass()} animate-in slide-in-from-right-full duration-300`}
          >
            <div className="flex items-start gap-3">
              {getIcon()}
              <div className="flex-1">
                <AlertTitle className="font-semibold text-foreground">
                  {toast.title}
                </AlertTitle>
                {toast.description && (
                  <AlertDescription className="mt-1 text-foreground/80">
                    {toast.description}
                  </AlertDescription>
                )}
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}
