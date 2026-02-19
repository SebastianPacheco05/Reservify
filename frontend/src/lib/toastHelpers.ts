type ToastFn = (props: { title: string; description?: string; variant?: "default" | "destructive" | "success" | "warning" }) => void;

export function showErrorToast(
  toast: ToastFn,
  error: unknown,
  fallbackMessage: string
): void {
  toast({
    title: "Error",
    description: error instanceof Error ? error.message : fallbackMessage,
    variant: "destructive",
  });
}
