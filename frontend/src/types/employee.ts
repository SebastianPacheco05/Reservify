export interface Restaurant {
    id: string
    name: string
    address: string
    phone: string
    capacity: number
    openTime: string
    closeTime: string
    image: string
  }
  
  export interface Table {
    id: string
    number: number
    seats: number
    status: "available" | "occupied" | "reserved" | "cleaning" | "out_of_service"
    currentReservation?: Reservation
    estimatedFreeTime?: string
    section: string
  }
  
  export interface Reservation {
    id: string
    customerName: string
    customerPhone: string
    date: string
    time: string
    guests: number
    status: "pending" | "confirmed" | "arrived" | "seated" | "completed" | "cancelled" | "no_show"
    tableId?: string
    specialRequests?: string
    estimatedDuration: number // en minutos
    arrivalTime?: string
  }
  
  export interface DailyFlow {
    hour: string
    customers: number
    reservations: number
    walkIns: number
  }
  
  export interface Bill {
    id: string
    tableNumber: number
    items: BillItem[]
    subtotal: number
    tax: number
    total: number
    status: "open" | "paid" | "pending"
    createdAt: string
    paidAt?: string
  }
  
  export interface BillItem {
    name: string
    quantity: number
    price: number
    total: number
  }
  