import type {
    RestaurantImage,
    RestaurantInfo,
    Review,
    MenuHighlight,
    RestaurantService,
    RestaurantHours,
    ContactInfo,
    ReservationData,
  } from "../types/restaurant.types"
  
  export class RestaurantDataService {
    private static instance: RestaurantDataService
    private restaurantId: string
  
    constructor(restaurantId = "default") {
      this.restaurantId = restaurantId
    }
  
    public static getInstance(restaurantId?: string): RestaurantDataService {
      if (!RestaurantDataService.instance) {
        RestaurantDataService.instance = new RestaurantDataService(restaurantId)
      }
      return RestaurantDataService.instance
    }
  
    // Método para obtener imágenes del restaurante
    public async getRestaurantImages(): Promise<RestaurantImage[]> {
      // Simulación de llamada a API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              url: "../../../public/terraza-1.webp",
              alt: "Vista principal del restaurante",
              isPrimary: true,
            },
            {
              id: "2",
              url: "../../../public/terraza-2.jpg",
              alt: "Interior elegante del restaurante",
            },
            {
              id: "3",
              url: "../../../public/terraza-3.jpg",
              alt: "Terraza con vista panorámica",
            },
            {
              id: "4",
              url: "../../../public/terraza-4.jpg",
              alt: "Cocina abierta y moderna",
            },
          ])
        }, 500)
      })
    }
  
    // Método para obtener información básica del restaurante
    public async getRestaurantInfo(): Promise<RestaurantInfo> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: this.restaurantId,
            name: "Restaurante La Terraza",
            description:
              "Disfruta de una experiencia gastronómica única en nuestro acogedor restaurante. Ofrecemos una fusión perfecta entre la cocina de mar tradicional y toques modernos, utilizando ingredientes frescos y de la más alta calidad. Nuestro ambiente elegante y servicio excepcional hacen de cada visita una ocasión especial.",
            rating: 4.8,
            totalReviews: 324,
            phone: "+34 912 345 678",
            address: "Calle Gran Vía 123, Madrid",
            schedule: "Mar-Dom: 12:00 - 23:00",
            cuisine: ["Mediterránea", "Mariscos", "Española"],
            badges: ["Cocina Mediterránea", "Mariscos Frescos", "Ambiente Romántico", "Terraza"],
            certifications: ["Certificado de Excelencia", "Restaurante Sostenible"],
          })
        }, 300)
      })
    }
  
    // Método para obtener reseñas de clientes
    public async getCustomerReviews(limit = 10): Promise<Review[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const allReviews: Review[] = [
            {
              id: "1",
              customerName: "María González",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 5,
              date: "2024-01-15",
              comment:
                "Excelente experiencia gastronómica. El ambiente es acogedor y la comida excepcional. Definitivamente volveremos.",
              verified: true,
            },
            {
              id: "2",
              customerName: "Carlos Rodríguez",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 5,
              date: "2024-01-10",
              comment: "El mejor restaurante de la ciudad. Servicio impecable y platos deliciosos. Muy recomendado.",
              verified: true,
            },
            {
              id: "3",
              customerName: "Ana Martínez",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 4,
              date: "2024-01-08",
              comment: "Muy buena comida y ambiente agradable. Los precios son justos para la calidad que ofrecen.",
              verified: false,
            },
            {
              id: "4",
              customerName: "Luis Fernández",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 5,
              date: "2024-01-05",
              comment: "Increíble atención al detalle. Cada plato es una obra de arte. Volveremos sin duda.",
              verified: true,
            },
            {
              id: "5",
              customerName: "Carmen López",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 4,
              date: "2024-01-03",
              comment: "Excelente ubicación y comida deliciosa. El personal es muy atento y profesional.",
              verified: true,
            },
          ]
          resolve(allReviews.slice(0, limit))
        }, 400)
      })
    }
  
    // Método para obtener platos destacados del menú
    public async getMenuHighlights(): Promise<MenuHighlight[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              name: "Paella Valenciana",
              description: "Auténtica paella con mariscos frescos y azafrán",
              price: 28.0,
              image: "/placeholder.svg?height=120&width=120",
              category: "Platos Principales",
              isPopular: true,
            },
            {
              id: "2",
              name: "Salmón a la Plancha",
              description: "Salmón fresco con vegetales de temporada",
              price: 24.0,
              image: "/placeholder.svg?height=120&width=120",
              category: "Pescados",
            },
            {
              id: "3",
              name: "Risotto de Hongos",
              description: "Cremoso risotto con hongos porcini y trufa",
              price: 22.0,
              image: "/placeholder.svg?height=120&width=120",
              category: "Vegetarianos",
              isPopular: true,
            },
            {
              id: "4",
              name: "Pulpo a la Gallega",
              description: "Pulpo tierno con papas, pimentón y aceite de oliva",
              price: 26.0,
              image: "/placeholder.svg?height=120&width=120",
              category: "Entrantes",
            },
          ])
        }, 600)
      })
    }
  
    // Método para obtener servicios disponibles
    public async getRestaurantServices(): Promise<RestaurantService[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "1",
              name: "WiFi Gratis",
              icon: "Wifi",
              color: "blue-500",
              available: true,
            },
            {
              id: "2",
              name: "Aparcamiento",
              icon: "Car",
              color: "green-500",
              available: true,
            },
            {
              id: "3",
              name: "Eventos Privados",
              icon: "Users",
              color: "purple-500",
              available: true,
            },
            {
              id: "4",
              name: "Pet Friendly",
              icon: "Heart",
              color: "red-500",
              available: true,
            },
            {
              id: "5",
              name: "Terraza",
              icon: "Sun",
              color: "yellow-500",
              available: true,
            },
            {
              id: "6",
              name: "Música en Vivo",
              icon: "Music",
              color: "indigo-500",
              available: false,
            },
          ])
        }, 200)
      })
    }
  
    // Método para obtener horarios detallados
    public async getRestaurantHours(): Promise<RestaurantHours[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { day: "Lunes", open: "", close: "", isClosed: true },
            { day: "Martes", open: "12:00", close: "23:00", isClosed: false },
            { day: "Miércoles", open: "12:00", close: "23:00", isClosed: false },
            { day: "Jueves", open: "12:00", close: "23:00", isClosed: false },
            { day: "Viernes", open: "12:00", close: "24:00", isClosed: false },
            { day: "Sábado", open: "12:00", close: "24:00", isClosed: false },
            { day: "Domingo", open: "12:00", close: "23:00", isClosed: false },
          ])
        }, 300)
      })
    }
  
    // Método para obtener información de contacto completa
    public async getContactInfo(): Promise<ContactInfo> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            phone: "+34 912 345 678",
            email: "reservas@labellavista.com",
            address: "Calle Gran Vía 123, 28013 Madrid, España",
            coordinates: {
              lat: 40.4168,
              lng: -3.7038,
            },
            socialMedia: {
              facebook: "https://facebook.com/labellavista",
              instagram: "https://instagram.com/labellavista",
              twitter: "https://twitter.com/labellavista",
            },
          })
        }, 250)
      })
    }
  
    // Método para obtener horarios disponibles para reservas
    public async getAvailableTimeSlots(date: string): Promise<string[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulación de disponibilidad basada en la fecha
          const baseSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "20:00", "20:30", "21:00", "21:30", "22:00"]
          // Simular algunos horarios ocupados
          const occupiedSlots = ["13:00", "20:30", "21:00"]
          const availableSlots = baseSlots.filter((slot) => !occupiedSlots.includes(slot))
          resolve(availableSlots)
        }, 400)
      })
    }
  
    // Método para enviar reservación
    public async submitReservation(
      reservationData: ReservationData,
    ): Promise<{ success: boolean; message: string; reservationId?: string }> {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulación de validación y envío
          if (!reservationData.name || !reservationData.phone || !reservationData.email) {
            resolve({
              success: false,
              message: "Por favor complete todos los campos obligatorios",
            })
            return
          }
  
          resolve({
            success: true,
            message: "¡Reservación confirmada exitosamente! Recibirá un email de confirmación.",
            reservationId: `RES-${Date.now()}`,
          })
        }, 1000)
      })
    }
  
    // Método para obtener estadísticas del restaurante
    public async getRestaurantStats(): Promise<{
      totalReservations: number
      averageRating: number
      totalReviews: number
      popularDishes: string[]
    }> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalReservations: 1250,
            averageRating: 4.8,
            totalReviews: 324,
            popularDishes: ["Paella Valenciana", "Risotto de Hongos", "Pulpo a la Gallega"],
          })
        }, 300)
      })
    }
  }
  