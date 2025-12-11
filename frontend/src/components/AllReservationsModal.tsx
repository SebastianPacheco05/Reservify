"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { User, Phone, Calendar, Clock, Users, UtensilsCrossed, Loader2, Search, X } from "lucide-react";
import { OwnerReservationsService, type Reserva } from "../services/OwnerReservationsService";

interface AllReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AllReservationsModal({ isOpen, onClose }: AllReservationsModalProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");

  // Cargar todas las reservas cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadAllReservations();
    }
  }, [isOpen]);

  // Filtrar reservas cuando cambia el searchQuery o estadoFilter
  useEffect(() => {
    filterReservations();
  }, [searchQuery, estadoFilter, reservas]);

  const loadAllReservations = async () => {
    setIsLoading(true);
    try {
      const response = await OwnerReservationsService.getAllReservations();
      setReservas(response.reservas || []);
    } catch (error) {
      console.error("Error al cargar todas las reservas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservas];

    // Filtrar por texto de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reserva) =>
          reserva.cliente_nombre.toLowerCase().includes(query) ||
          reserva.nombre_restaurante.toLowerCase().includes(query) ||
          reserva.cliente_telefono.includes(query) ||
          reserva.id_reserva.toString().includes(query)
      );
    }

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      filtered = filtered.filter(
        (reserva) => reserva.estado_reserva.toLowerCase() === estadoFilter.toLowerCase()
      );
    }

    setFilteredReservas(filtered);
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

  const handleClose = () => {
    setSearchQuery("");
    setEstadoFilter("todos");
    onClose();
  };

  // Obtener estados únicos para los filtros
  const estadosUnicos = Array.from(
    new Set(reservas.map((r) => r.estado_reserva))
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Todas las Reservas</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Cargando reservas..."
              : `Mostrando ${filteredReservas.length} de ${reservas.length} reservas totales`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Cargando todas las reservas...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, restaurante, teléfono o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={estadoFilter === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEstadoFilter("todos")}
                  className="whitespace-nowrap"
                >
                  Todos
                </Button>
                {estadosUnicos.map((estado) => (
                  <Button
                    key={estado}
                    variant={estadoFilter === estado ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEstadoFilter(estado)}
                    className="whitespace-nowrap"
                  >
                    {estado}
                  </Button>
                ))}
              </div>
            </div>

            {/* Lista de reservas con scroll */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {filteredReservas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    {searchQuery || estadoFilter !== "todos"
                      ? "No se encontraron reservas con los filtros aplicados"
                      : "No hay reservas disponibles"}
                  </p>
                </div>
              ) : (
                filteredReservas.map((reserva) => (
                  <div
                    key={reserva.id_reserva}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UtensilsCrossed className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 truncate">
                            {reserva.nombre_restaurante}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            #{reserva.id_reserva}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{reserva.cliente_nombre}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{reserva.cliente_telefono}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{formatearFecha(reserva.fecha)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{reserva.horario}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{reserva.num_comensales} personas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getEstadoBadge(reserva.estado_reserva)} ml-4 flex-shrink-0`}
                    >
                      {reserva.estado_reserva}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

