"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { EditProfileModal } from "../components/edit_profile_modal";
import { AllReservationsModal } from "../components/AllReservationsModal";
import { User, Phone, FileText, Globe, Calendar, Clock, Users, UtensilsCrossed } from "lucide-react";
import { authFetch } from "../services/authService";
import { getApiEndpoint } from "../config/api";

interface Cliente {
  id_cliente: number;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  nacionalidad: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
}

interface Reserva {
  id_reserva: number;
  horario: string;
  fecha: string;
  estado_reserva: string;
  id_mesa: number;
  cant_personas: number;
  nombre_restaurante: string;
  nit: number;
  num_comensales: number;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_documento: number;
}

interface Metricas {
  total_restaurantes: number;
  reservas_activas: number;
  revenue_mes: number;
}

export default function ClientDashboard() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAllReservationsModalOpen, setIsAllReservationsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReservas, setIsLoadingReservas] = useState(true);
  const [isLoadingMetricas, setIsLoadingMetricas] = useState(true);

  // Cargar métricas del dueño
  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setIsLoadingMetricas(true);
        const response = await authFetch(getApiEndpoint("/data-owner/metricas"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las métricas");
        }

        const data = await response.json();
        setMetricas(data);
      } catch (error) {
        console.error("Error al cargar métricas:", error);
      } finally {
        setIsLoadingMetricas(false);
      }
    };

    fetchMetricas();
  }, []);

  // Cargar reservas del dueño
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setIsLoadingReservas(true);
        const response = await authFetch(getApiEndpoint("/data-owner/reservas"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las reservas");
        }

        const data = await response.json();
        setReservas(data.reservas || []);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      } finally {
        setIsLoadingReservas(false);
      }
    };

    fetchReservas();
  }, []);

  // Cargar datos del usuario actual (documento desde login)
  useEffect(() => {
    const documento = localStorage.getItem("documento");
    if (!documento) {
      setIsLoading(false);
      return;
    }
    authFetch(getApiEndpoint("/cliente/listar_cliente") + "?documento=" + encodeURIComponent(documento), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const clienteData = data.respuesta;
        if (clienteData) {
          setCliente({
            id_cliente: Number(clienteData.documento),
            nombre1: clienteData.nombre ?? "",
            nombre2: "",
            apellido1: clienteData.apellido ?? "",
            apellido2: "",
            nacionalidad: clienteData.nacionalidad ?? "",
            tipo_documento: clienteData.tipo_documento ?? "",
            numero_documento: String(clienteData.documento ?? ""),
            telefono: clienteData.telefono ?? "",
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleProfileUpdate = (updatedCliente: Cliente) => {
    setCliente(updatedCliente);
    setIsEditModalOpen(false);
  };

  // Función para obtener el color del badge según el estado
  const getEstadoBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "confirmada":
      case "completada":
        return "bg-primary/10 text-primary border-primary/30";
      case "pendiente":
        return "bg-accent/20 text-accent-foreground border-accent/30";
      case "cancelada":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No se pudo cargar la información del perfil
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = `${cliente.nombre1} ${cliente.nombre2 || ""} ${
    cliente.apellido1
  } ${cliente.apellido2 || ""}`.trim();
  const initials = `${cliente.nombre1[0]}${cliente.apellido1[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <motion.div
        className="bg-card shadow-sm border-b border-border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Bienvenido, {cliente.nombre1}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Editar perfil
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <Card className="rounded-2xl border-border shadow-lg">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{fullName}</CardTitle>
                <CardDescription>Cliente #{cliente.id_cliente}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {cliente.tipo_documento}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cliente.numero_documento}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Teléfono
                    </p>
                    <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Nacionalidad
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cliente.nacionalidad}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dashboard Content */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <Card className="rounded-2xl border-border shadow-lg">
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
                <CardDescription>
                  Estadísticas de tus restaurantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMetricas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando estadísticas...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {metricas?.total_restaurantes || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Restaurantes
                      </div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        {metricas?.reservas_activas || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Reservas Activas
                      </div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-accent-foreground">
                        ${metricas?.revenue_mes?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm text-muted-foreground">Ingresos del Mes</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Reservas Recientes</CardTitle>
                  <CardDescription>
                    Las 50 reservas más recientes de todos tus restaurantes
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsAllReservationsModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  Ver todas las reservas
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingReservas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando reservas...</p>
                  </div>
                ) : reservas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay reservas disponibles</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {reservas.map((reserva) => (
                      <div
                        key={reserva.id_reserva}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">
                                {reserva.nombre_restaurante}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                #{reserva.id_reserva}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                <span>{reserva.cliente_nombre}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{reserva.cliente_telefono}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatearFecha(reserva.fecha)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{reserva.horario}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{reserva.num_comensales} personas</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={getEstadoBadge(reserva.estado_reserva)}
                        >
                          {reserva.estado_reserva}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cliente={cliente}
        onUpdate={handleProfileUpdate}
      />

      {/* All Reservations Modal */}
      <AllReservationsModal
        isOpen={isAllReservationsModalOpen}
        onClose={() => setIsAllReservationsModalOpen(false)}
      />
    </div>
  );
}
