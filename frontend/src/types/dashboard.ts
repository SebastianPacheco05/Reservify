export interface Restaurant {
  id: string
  name: string
  location: string
  cuisine: string
  rating: number
  totalTables: number
  status: "active" | "inactive"
  image: string
}

export interface Reservation {
  id: string
  restaurantId: string
  restaurantName: string
  customerName: string
  customerEmail: string
  date: string
  time: string
  guests: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  tableNumber?: number
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
  invoiceNumber: string
}
