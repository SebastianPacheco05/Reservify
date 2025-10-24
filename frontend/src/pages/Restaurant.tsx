"use client";

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Skeleton } from "../components/ui/skeleton";
import {
  MapPin,
  Clock,
  Star,
  Calendar,
  Users,
  CreditCard,
} from "lucide-react";

import { useRestaurantData } from "../hooks/useRestaurantData";
import { useToastContext } from "../components/ToastProvider";

export default function RestaurantPage() {
  const { toast } = useToastContext();
  const [searchParams] = useSearchParams();
  const restaurantNIT = Number(searchParams.get("nit") || 0);
  const { restaurantInfo, mesas, comentarios, loading, getAvailableSlots } =
    useRestaurantData(restaurantNIT);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    mesaId: "",
  });

  const handleDateChange = async (date: string) => {
    setReservationData({ ...reservationData, date });
    if (date) {
      const slots = await getAvailableSlots(date);
      setAvailableSlots(slots);
    }
  };

  const handlePaymentReservation = async () => {
    try {
      // Validar que todos los campos estén completos
      if (!reservationData.date || !reservationData.time || !reservationData.guests || !reservationData.mesaId) {
        toast({
          title: "Campos incompletos",
          description: "Por favor completa todos los campos de la reserva",
          variant: "warning"
        });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Sesión requerida",
          description: "Debes iniciar sesión para hacer una reserva",
          variant: "warning"
        });
        return;
      }

      // Obtener el precio de la mesa seleccionada
      const mesaSeleccionada = mesas.find(m => m.id_mesa.toString() === reservationData.mesaId);
      if (!mesaSeleccionada) {
        toast({
          title: "Error de selección",
          description: "Mesa no encontrada",
          variant: "destructive"
        });
        return;
      }

      // Obtener el email del cliente desde el token JWT
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const emailCliente = tokenPayload.sub;

      if (!emailCliente) {
        toast({
          title: "Error de autenticación",
          description: "No se pudo obtener la información del cliente",
          variant: "destructive"
        });
        return;
      }

      // Usar la nueva función de reserva que crea factura y reserva en una sola operación
      const reservaResponse = await fetch("http://localhost:8000/facturas/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          p_nit: restaurantNIT,
          p_nombre_restaurante: restaurantInfo?.nombre_restaurante || "",
          p_direccion: restaurantInfo?.direccion || "",
          p_ciudad: "Bogotá",
          p_email_cliente: emailCliente,
          p_id_mesa: parseInt(reservationData.mesaId),
          p_num_comensales: parseInt(reservationData.guests),
          p_horario: reservationData.time,
          p_fecha: reservationData.date
        })
      });

      if (!reservaResponse.ok) {
        const errorData = await reservaResponse.json();
        throw new Error(errorData.detail || "Error al procesar la reserva");
      }

      const reservaData = await reservaResponse.json();

      // Guardar datos para la pasarela de pagos
      const paymentData = {
        id_encab_fact: reservaData.id_encab_fact,
        restaurant: restaurantInfo,
        mesa: mesaSeleccionada,
        guests: parseInt(reservationData.guests),
        fecha: reservationData.date,
        horario: reservationData.time
      };

      sessionStorage.setItem("pendingReservation", JSON.stringify(paymentData));

      // Redirigir a la pasarela de pagos
      window.location.href = "/Pasarela_pagos";
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      toast({
        title: "Error en la reserva",
        description: (error as { message?: string })?.message || "Error al procesar la reserva. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ));
  };

  if (loading.info) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Imagen del Restaurante */}
      <div className="relative h-96 rounded-xl overflow-hidden group">
        {restaurantInfo && (
          <img
            src={restaurantInfo.url_image || "/placeholder.svg"}
            alt={restaurantInfo.nombre_restaurante}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título y Descripción */}
          {restaurantInfo && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {restaurantInfo.nombre_restaurante}
                  </h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center">
                      {renderStars(Math.floor(restaurantInfo.rating))}
                      <span className="ml-2 text-sm text-gray-600">
                        {restaurantInfo.rating} ({restaurantInfo.reviews}{" "}
                        reseñas)
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {restaurantInfo.nombre_categoria}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {restaurantInfo.descripcion_restaurante}
              </p>

              <div className="flex items-center space-x-4">
                <Badge variant={restaurantInfo.availabletoday ? "default" : "secondary"}>
                  {restaurantInfo.availabletoday ? "Disponible Hoy" : "No Disponible"}
                </Badge>
              </div>
            </div>
          )}

          {/* Información de Contacto */}
          {restaurantInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Información del Restaurante</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-gray-600">{restaurantInfo.direccion}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Horarios</p>
                      <p className="text-gray-600">
                        {restaurantInfo.horario_apertura} - {restaurantInfo.horario_cierre}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mesas Disponibles */}
          {!loading.mesas && mesas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Mesas Disponibles</CardTitle>
                <CardDescription>
                  Seleccione una mesa para su reserva
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {mesas
                    .filter((mesa) => mesa.estado_de_disponibilidad)
                    .map((mesa) => (
                      <div
                        key={mesa.id_mesa}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Mesa #{mesa.id_mesa}</h4>
                          <Badge variant="secondary" className="text-xs">
                            Disponible
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            {mesa.cant_personas} personas
                          </span>
                        </div>
                        <p className="font-bold text-lg text-green-600">
                          ${mesa.precio.toFixed(2)}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comentarios */}
          {!loading.comentarios && comentarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Comentarios de Clientes</span>
                </CardTitle>
                <CardDescription>
                  Lo que dicen nuestros clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {comentarios.map((comentario) => (
                  <div
                    key={comentario.id_comentario}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center mb-2">
                        {renderStars(comentario.calificacion)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comentario.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comentario.comentario}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Formulario de Reserva */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Hacer Reserva</span>
              </CardTitle>
              <CardDescription>Reserve su mesa ahora</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={reservationData.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Hora</Label>
                  <Select
                    onValueChange={(value) =>
                      setReservationData({ ...reservationData, time: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="guests">Número de Comensales</Label>
                <Select
                  onValueChange={(value) =>
                    setReservationData({ ...reservationData, guests: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "persona" : "personas"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mesa">Seleccionar Mesa</Label>
                <Select
                  onValueChange={(value) =>
                    setReservationData({ ...reservationData, mesaId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesas
                      .filter((mesa) => mesa.estado_de_disponibilidad)
                      .map((mesa) => (
                        <SelectItem
                          key={mesa.id_mesa}
                          value={mesa.id_mesa.toString()}
                        >
                          Mesa #{mesa.id_mesa} - {mesa.cant_personas} personas
                          - ${mesa.precio}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Hacer Pago de Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Confirmar Pago de Reserva</DialogTitle>
                    <DialogDescription>
                      Revise los detalles de su reserva antes de proceder al
                      pago
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Resumen de Reserva */}
                    <div className="rounded-lg border p-4 space-y-3">
                      <h3 className="font-semibold text-lg">
                        Resumen de Reserva
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Restaurante:</span>
                          <span className="font-medium">
                            {restaurantInfo?.nombre_restaurante || "No disponible"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha:</span>
                          <span className="font-medium">
                            {reservationData.date ? new Date(reservationData.date).toLocaleDateString('es-ES') : "No seleccionada"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hora:</span>
                          <span className="font-medium">
                            {reservationData.time || "No seleccionada"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Comensales:</span>
                          <span className="font-medium">
                            {reservationData.guests || "0"} personas
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mesa:</span>
                          <span className="font-medium">
                            Mesa #{reservationData.mesaId || "No seleccionada"} - {mesas.find(m => m.id_mesa.toString() === reservationData.mesaId)?.cant_personas || 0} personas
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total a Pagar:</span>
                          <span className="text-2xl font-bold text-green-600">
                            $
                            {mesas
                              .find(
                                (m) =>
                                  m.id_mesa.toString() ===
                                  reservationData.mesaId
                              )
                              ?.precio.toFixed(2) || "0.00"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          * El pago se procesará en la siguiente pantalla
                        </p>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handlePaymentReservation}
                      >
                        Proceder al Pago
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>• Las reservas se confirman tras el pago</p>
              <p>• Cancelaciones gratuitas hasta 2 horas antes</p>
              <p>• Mesa reservada por 2 horas máximo</p>
              <p>• Aceptamos todas las tarjetas de crédito</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
