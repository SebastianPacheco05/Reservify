"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RestaurantDataService } from "../services/RestaurantDataService";
import type {
  RestaurantDetailFromDB,
  MesaFromDB,
  ComentarioFromDB,
} from "../types/restaurant.types";

export const useRestaurantData = (restauranteUid?: string) => {
  const uid = restauranteUid ?? "";
  const service = useMemo(() => new RestaurantDataService(uid), [uid]);

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
  const loadAllData = useCallback(async () => {
    if (!restauranteUid) return;

    setLoading({
      info: true,
      mesas: true,
      comentarios: true,
    });

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
      setLoading({
        info: false,
        mesas: false,
        comentarios: false,
      });
    }
  }, [restauranteUid, service]);

  // Función para obtener horarios disponibles
  const getAvailableSlots = useCallback(
    async (date: string) => {
      try {
        return await service.getAvailableTimeSlots(date);
      } catch (error) {
        console.error("Error getting available slots:", error);
        return [];
      }
    },
    [service],
  );

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

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
