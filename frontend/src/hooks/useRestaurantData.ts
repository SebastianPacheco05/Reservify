"use client";

import { useState, useEffect } from "react";
import { RestaurantDataService } from "../services/RestaurantDataService";
import type {
  RestaurantDetailFromDB,
  MesaFromDB,
  ComentarioFromDB,
} from "../types/restaurant.types";

export const useRestaurantData = (restaurantNIT?: number) => {
  const [service] = useState(() =>
    RestaurantDataService.getInstance(restaurantNIT)
  );

  // Estados para diferentes tipos de datos
  const [restaurantInfo, setRestaurantInfo] =
    useState<RestaurantDetailFromDB | null>(null);
  const [mesas, setMesas] = useState<MesaFromDB[]>([]);
  const [comentarios, setComentarios] = useState<ComentarioFromDB[]>([]);

  // Estados de carga
  const [loading, setLoading] = useState({
    info: true,
    mesas: true,
    comentarios: true,
  });

  // Función para cargar todos los datos
  const loadAllData = async () => {
    try {
      const [infoData, mesasData, comentariosData] = await Promise.all([
        service.getRestaurantInfo(),
        service.getMesas(),
        service.getComentarios(),
      ]);

      setRestaurantInfo(infoData);
      setMesas(mesasData);
      setComentarios(comentariosData);

      setLoading({
        info: false,
        mesas: false,
        comentarios: false,
      });
    } catch (error) {
      console.error("Error loading restaurant data:", error);
    }
  };

  // Función para obtener horarios disponibles
  const getAvailableSlots = async (date: string) => {
    try {
      return await service.getAvailableTimeSlots(date);
    } catch (error) {
      console.error("Error getting available slots:", error);
      return [];
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    // Datos
    restaurantInfo,
    mesas,
    comentarios,

    // Estados de carga
    loading,

    // Funciones
    getAvailableSlots,
    refreshData: loadAllData,
  };
};
