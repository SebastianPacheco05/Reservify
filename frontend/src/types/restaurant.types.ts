export interface RestaurantImage {
    id: string
    url: string
    alt: string
    isPrimary?: boolean
  }
  
  export interface RestaurantInfo {
    id: string
    name: string
    description: string
    rating: number
    totalReviews: number
    phone: string
    address: string
    schedule: string
    cuisine: string[]
    badges: string[]
    certifications: string[]
  }
  
  export interface Review {
    id: string
    customerName: string
    avatar: string
    rating: number
    date: string
    comment: string
    verified?: boolean
  }
  
  export interface MenuHighlight {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    isPopular?: boolean
  }
  
  export interface RestaurantService {
    id: string
    name: string
    icon: string
    color: string
    available: boolean
  }
  
  export interface ReservationData {
    date: string
    time: string
    guests: string
    name: string
    phone: string
    email: string
    specialRequests: string
  }
  
  export interface RestaurantHours {
    day: string
    open: string
    close: string
    isClosed: boolean
  }
  
  export interface ContactInfo {
    phone: string
    email: string
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    socialMedia: {
      facebook?: string
      instagram?: string
      twitter?: string
    }
  }
  