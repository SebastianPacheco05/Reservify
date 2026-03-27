import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CheckoutPage, { type ReservationData } from "../components/CheckoutPage";
import { Skeleton } from "../components/ui/skeleton";

export default function PaymentGateway() {
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem("pendingReservation");
    if (data) {
      setReservationData(JSON.parse(data));
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!reservationData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <p className="text-sm text-muted-foreground">Cargando datos de tu reserva…</p>
          </div>
        </div>
      </div>
    );
  }

  return <CheckoutPage reservationData={reservationData} />;
}
