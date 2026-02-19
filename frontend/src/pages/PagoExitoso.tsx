import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle, Home } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function PagoExitoso() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Redirigir después de 5 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          sessionStorage.removeItem("pendingReservation")
          navigate("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const transactionId = searchParams.get("transaction_id")
  const reference = searchParams.get("reference")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center border-0 shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          ¡Pago Exitoso!
        </h1>

        <p className="text-lg text-muted-foreground mb-6">
          Tu reserva ha sido confirmada correctamente.
        </p>

        {transactionId && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">ID de Transacción:</p>
            <p className="text-sm font-mono text-foreground">{transactionId}</p>
          </div>
        )}

        {reference && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Referencia:</p>
            <p className="text-sm font-mono text-foreground">{reference}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => {
              sessionStorage.removeItem("pendingReservation")
              navigate("/")
            }}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </button>

          <p className="text-sm text-muted-foreground">
            Serás redirigido automáticamente en {countdown} segundos...
          </p>
        </div>
      </Card>
    </div>
  )
}
