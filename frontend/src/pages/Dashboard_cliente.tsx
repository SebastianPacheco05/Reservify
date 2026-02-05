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
        const response = await authFetch(`${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/data-owner/metricas`, {
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
        const response = await authFetch(`${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/data-owner/reservas`, {
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

  // Simular carga de datos del usuario actual
  useEffect(() => {
    // Aquí normalmente obtendrías el ID del usuario actual desde el contexto de autenticación
    const currentUserId = 1; // Ejemplo

    fetch(`${import.meta.env.VITE_API_URL || "http://10.5.213.111:1106"}/listar_cliente`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente: currentUserId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const clienteData = data.respuesta;
        if (clienteData) {
          setCliente({
            id_cliente: clienteData.id_cliente,
            nombre1: clienteData.nombre1,
            nombre2: clienteData.nombre2,
            apellido1: clienteData.apellido1,
            apellido2: clienteData.apellido2,
            nacionalidad: clienteData.nacionalidad,
            tipo_documento: clienteData.tipo_documento,
            numero_documento: clienteData.documento,
            telefono: clienteData.telefono,
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
        return "bg-green-50 text-green-700 border-green-200";
      case "pendiente":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelada":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">
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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback className="bg-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Bienvenido, {cliente.nombre1}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
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
            <Card className="rounded-2xl border-slate-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{fullName}</CardTitle>
                <CardDescription>Cliente #{cliente.id_cliente}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cliente.tipo_documento}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cliente.numero_documento}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Teléfono
                    </p>
                    <p className="text-sm text-gray-600">{cliente.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Nacionalidad
                    </p>
                    <p className="text-sm text-gray-600">
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
            <Card className="rounded-2xl border-slate-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
                <CardDescription>
                  Estadísticas de tus restaurantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMetricas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {metricas?.total_restaurantes || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Restaurantes
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {metricas?.reservas_activas || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Reservas Activas
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ${metricas?.revenue_mes?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm text-gray-600">Ingresos del Mes</div>
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando reservas...</p>
                  </div>
                ) : reservas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No hay reservas disponibles</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {reservas.map((reserva) => (
                      <div
                        key={reserva.id_reserva}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {reserva.nombre_restaurante}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                #{reserva.id_reserva}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
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
