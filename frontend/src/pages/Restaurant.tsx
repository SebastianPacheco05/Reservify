"use client";

import type React from "react";
import { useState } from "react";
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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Award,
  Utensils,
  Wifi,
  Car,
} from "lucide-react";

import { useRestaurantData } from "../hooks/useRestaurantData";
import type { ReservationData } from "../types/restaurant.types";

export default function RestaurantPage() {
  const {
    images,
    restaurantInfo,
    reviews,
    menuHighlights,
    services,
    contactInfo,
    loading,
    loadMoreReviews,
    getAvailableSlots,
    submitReservation,
  } = useRestaurantData();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [reservationData, setReservationData] = useState<ReservationData>({
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
    email: "",
    specialRequests: "",
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDateChange = async (date: string) => {
    setReservationData({ ...reservationData, date });
    if (date) {
      const slots = await getAvailableSlots(date);
      setAvailableSlots(slots);
    }
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitReservation(reservationData);

    if (result.success) {
      alert(`${result.message}\nID de Reservación: ${result.reservationId}`);
      // Resetear formulario
      setReservationData({
        date: "",
        time: "",
        guests: "",
        name: "",
        phone: "",
        email: "",
        specialRequests: "",
      });
    } else {
      alert(result.message);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Wifi,
      Car,
      Users,
      Heart,
    };
    const IconComponent = icons[iconName] || Heart;
    return IconComponent;
  };

  if (loading.info || loading.images) {
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
      {/* Carrusel de Imágenes */}
      <div className="relative h-96 rounded-xl overflow-hidden group">
        {images.length > 0 && (
          <img
            src={images[currentImageIndex]?.url || "/placeholder.svg"}
            alt={images[currentImageIndex]?.alt || "Restaurante"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {/* Controles del carrusel */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isLiked ? "bg-red-500 text-white" : "bg-white/80 hover:bg-white"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 bg-white/80 hover:bg-white rounded-full transition-all duration-200">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
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
                    {restaurantInfo.name}
                  </h1>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center">
                      {renderStars(Math.floor(restaurantInfo.rating))}
                      <span className="ml-2 text-sm text-gray-600">
                        {restaurantInfo.rating} ({restaurantInfo.totalReviews}{" "}
                        reseñas)
                      </span>
                    </div>
                    {restaurantInfo.certifications.map((cert, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <Award className="h-3 w-3" />
                        <span>{cert}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {restaurantInfo.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {restaurantInfo.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Información de Contacto */}
          {contactInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Información de Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                  {restaurantInfo && (
                    <>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Horarios</p>
                          <p className="text-gray-600">
                            {restaurantInfo.schedule}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Utensils className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Tipo de Cocina</p>
                          <p className="text-gray-600">
                            {restaurantInfo.cuisine.join(", ")}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Servicios y Comodidades */}
          {!loading.services && services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Servicios y Comodidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {services
                    .filter((service) => service.available)
                    .map((service) => {
                      const IconComponent = getIconComponent(service.icon);
                      return (
                        <div
                          key={service.id}
                          className="flex items-center space-x-2"
                        >
                          <IconComponent
                            className={`h-4 w-4 text-${service.color}`}
                          />
                          <span className="text-sm">{service.name}</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platos Destacados */}
          {!loading.menu && menuHighlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Platos Destacados</CardTitle>
                <CardDescription>
                  Nuestras especialidades más populares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {menuHighlights.map((dish) => (
                    <div
                      key={dish.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={dish.image || "/placeholder.svg"}
                        alt={dish.name}
                        className="w-full h-24 object-cover rounded-md mb-3"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{dish.name}</h4>
                        {dish.isPopular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {dish.description}
                      </p>
                      <p className="font-bold text-lg text-green-600">
                        ${dish.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reseñas */}
          {!loading.reviews && reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Reseñas de Clientes</span>
                </CardTitle>
                <CardDescription>
                  Lo que dicen nuestros clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.customerName}
                        />
                        <AvatarFallback>
                          {review.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">
                              {review.customerName}
                            </h4>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => loadMoreReviews(10)}
                >
                  Ver todas las reseñas
                </Button>
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
            <CardContent>
              <form onSubmit={handleReservation} className="space-y-4">
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

                <Separator />

                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={reservationData.name}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={reservationData.phone}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={reservationData.email}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requests">Peticiones Especiales</Label>
                  <Textarea
                    id="requests"
                    placeholder="Alergias, celebraciones, preferencias de mesa..."
                    value={reservationData.specialRequests}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        specialRequests: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Confirmar Reserva
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>• Las reservas se confirman por teléfono o email</p>
              <p>• Cancelaciones gratuitas hasta 2 horas antes</p>
              <p>• Mesa reservada por 2 horas máximo</p>
              <p>• Aceptamos todas las tarjetas de crédito</p>
              <p>• Código de vestimenta: Smart casual</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
