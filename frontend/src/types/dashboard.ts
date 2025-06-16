export interface Restaurant {
    id: string
    name: string
    address: string
    phone: string
    capacity: number
    status: "active" | "inactive"
    image: string
  }
  
  export interface Reservation {
    id: string
    restaurantId: string
    restaurantName: string
    customerName: string
    customerEmail: string
    customerPhone: string
    date: string
    time: string
    guests: number
    status: "confirmed" | "pending" | "cancelled" | "completed"
    specialRequests?: string
  }
  
  export interface MonthlyFlow {
    month: string
    visitors: number
    reservations: number
    revenue: number
  }
  
  export interface Invoice {
    id: string
    restaurantId: string
    restaurantName: string
    amount: number
    date: string
    status: "paid" | "pending" | "overdue"
    dueDate: string
    items: InvoiceItem[]
  }
  
  export interface InvoiceItem {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }
  