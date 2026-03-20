"use client";

import { useState, useEffect } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { authFetch, isAuthenticated } from "../services/authService";
import { getApiEndpoint } from "../config/api";
import { useToastContext } from "./ToastProvider";

interface ReviewFormProps {
  restauranteUid: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ restauranteUid, onReviewSubmitted }: ReviewFormProps) {
  const { toast } = useToastContext();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Verificar si el usuario ya tiene un comentario
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!isAuthenticated()) {
        setChecking(false);
        return;
      }

      try {
        const response = await authFetch(
          getApiEndpoint(`/comentarios/verificar/${restauranteUid}`)
        );
        
        if (response.ok) {
          const data = await response.json();
          setAlreadyReviewed(data.ya_tiene_comentario || false);
        }
      } catch (error) {
        console.error("Error verificando comentario:", error);
      } finally {
        setChecking(false);
      }
    };

    checkExistingReview();
  }, [restauranteUid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dejar una reseña",
        variant: "warning",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Calificación requerida",
        description: "Por favor selecciona una calificación de 1 a 5 estrellas",
        variant: "warning",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comentario muy corto",
        description: "Por favor escribe al menos 10 caracteres en tu comentario",
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authFetch(getApiEndpoint("/comentarios/crear"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurante_uid: restauranteUid,
          comentario: comment.trim(),
          calificacion: rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al enviar la reseña");
      }

      setSubmitted(true);
      setComment("");
      setRating(0);
      
      toast({
        title: "¡Reseña enviada!",
        description: "Tu reseña ha sido publicada exitosamente",
        variant: "success",
      });

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Recargar después de 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error al enviar reseña:", error);
      toast({
        title: "No pudimos enviar tu reseña",
        description: "Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Deja tu Reseña</span>
          </CardTitle>
          <CardDescription>
            Inicia sesión para dejar una reseña sobre este restaurante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => (window.location.href = "/Login")}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (alreadyReviewed) {
    return (
      <Card className="border-primary/30 bg-primary/10">
        <CardContent className="py-6">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                Ya has dejado una reseña
              </p>
              <p className="text-sm text-muted-foreground">
                Solo puedes dejar una reseña por restaurante. Gracias por tu opinión.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="border-primary/30 bg-primary/10">
        <CardContent className="py-6">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                ¡Reseña enviada exitosamente!
              </p>
              <p className="text-sm text-muted-foreground">
                Tu reseña será visible en breve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <span>Deja tu Reseña</span>
        </CardTitle>
        <CardDescription>
          Comparte tu experiencia con otros clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Estrellas */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Calificación *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Calificar con ${star} ${star === 1 ? "estrella" : "estrellas"}`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/50"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-foreground">
                  {rating} {rating === 1 ? "estrella" : "estrellas"}
                </span>
              )}
            </div>
            {rating === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Selecciona de 1 a 5 estrellas
              </p>
            )}
          </div>

          {/* Textarea para comentario */}
          <div>
            <label
              htmlFor="comment"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Tu Comentario *
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia en este restaurante..."
              className="min-h-[120px] resize-none"
              required
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Mínimo 10 caracteres
              </p>
              <p className="text-xs text-muted-foreground">
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={loading || rating === 0 || comment.trim().length < 10}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Reseña
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Al enviar tu reseña, aceptas que solo puedes dejar una reseña por restaurante
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
