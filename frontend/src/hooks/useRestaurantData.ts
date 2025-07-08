"use client"

import { useState, useEffect } from "react"
import { RestaurantDataService } from "../services/RestaurantDataService"
import type {
  RestaurantImage,
  RestaurantInfo,
  Review,
  MenuHighlight,
  RestaurantService,
  ContactInfo,
} from "../types/restaurant.types"

export const useRestaurantData = (restaurantId?: string) => {
  const [service] = useState(() => RestaurantDataService.getInstance(restaurantId))

  // Estados para diferentes tipos de datos
  const [images, setImages] = useState<RestaurantImage[]>([])
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [menuHighlights, setMenuHighlights] = useState<MenuHighlight[]>([])
  const [services, setServices] = useState<RestaurantService[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  // Estados de carga
  const [loading, setLoading] = useState({
    images: true,
    info: true,
    reviews: true,
    menu: true,
    services: true,
    contact: true,
  })

  // Función para cargar todos los datos
  const loadAllData = async () => {
    try {
      const [imagesData, infoData, reviewsData, menuData, servicesData, contactData] = await Promise.all([
        service.getRestaurantImages(),
        service.getRestaurantInfo(),
        service.getCustomerReviews(3),
        service.getMenuHighlights(),
        service.getRestaurantServices(),
        service.getContactInfo(),
      ])

      setImages(imagesData)
      setRestaurantInfo(infoData)
      setReviews(reviewsData)
      setMenuHighlights(menuData)
      setServices(servicesData)
      setContactInfo(contactData)

      setLoading({
        images: false,
        info: false,
        reviews: false,
        menu: false,
        services: false,
        contact: false,
      })
    } catch (error) {
      console.error("Error loading restaurant data:", error)
    }
  }

  // Función para cargar más reseñas
  const loadMoreReviews = async (limit = 10) => {
    try {
      const moreReviews = await service.getCustomerReviews(limit)
      setReviews(moreReviews)
    } catch (error) {
      console.error("Error loading more reviews:", error)
    }
  }

  // Función para obtener horarios disponibles
  const getAvailableSlots = async (date: string) => {
    try {
      return await service.getAvailableTimeSlots(date)
    } catch (error) {
      console.error("Error getting available slots:", error)
      return []
    }
  }

  // Función para enviar reservación
  const submitReservation = async (reservationData: any) => {
    try {
      return await service.submitReservation(reservationData)
    } catch (error) {
      console.error("Error submitting reservation:", error)
      return { success: false, message: "Error al enviar la reservación" }
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  return {
    // Datos
    images,
    restaurantInfo,
    reviews,
    menuHighlights,
    services,
    contactInfo,

    // Estados de carga
    loading,

    // Funciones
    loadMoreReviews,
    getAvailableSlots,
    submitReservation,
    refreshData: loadAllData,
  }
}
