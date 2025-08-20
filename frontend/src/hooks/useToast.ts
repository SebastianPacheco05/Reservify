// frontend/src/hooks/use-toast.ts
export function useToast() {
    return {
      toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
        // Aquí puedes usar una librería de notificaciones o simplemente un alert temporal
        alert(`${title}\n${description}`);
      },
    };
  }