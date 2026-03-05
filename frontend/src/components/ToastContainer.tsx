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
              return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'destructive':
              return <XCircle className="h-4 w-4 text-red-600" />;
            case 'warning':
              return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            default:
              return <Info className="h-4 w-4 text-blue-600" />;
          }
        };

        const getVariantClass = () => {
          // Fondo según tipo de mensaje, pero siempre texto en negro
          switch (toast.variant) {
            case 'success':
              return 'border-green-200 bg-green-50 text-black';
            case 'destructive':
              return 'border-red-200 bg-red-50 text-black';
            case 'warning':
              return 'border-yellow-200 bg-yellow-50 text-black';
            default:
              return 'border-blue-200 bg-blue-50 text-black';
          }
        };

        return (
          <Alert
            key={toast.id}
            className={`${getVariantClass()} shadow-lg animate-in slide-in-from-right-full duration-300`}
          >
            <div className="flex items-start gap-3">
              {getIcon()}
              <div className="flex-1">
                <AlertTitle className="font-medium text-black">
                  {toast.title}
                </AlertTitle>
                {toast.description && (
                  <AlertDescription className="mt-1 text-black">
                    {toast.description}
                  </AlertDescription>
                )}
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
