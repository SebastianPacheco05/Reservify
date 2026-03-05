type ToastFn = (props: { title: string; description?: string; variant?: "default" | "destructive" | "success" | "warning" }) => void;

export function showErrorToast(
  toast: ToastFn,
  error: unknown,
  fallbackMessage: string
): void {
  // Registrar el error completo en consola para debug,
  // pero mostrar un mensaje amigable al usuario.
  // eslint-disable-next-line no-console
  console.error(error);

  toast({
    title: "Error",
    description: fallbackMessage,
    variant: "destructive",
  });
}
