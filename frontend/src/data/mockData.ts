import type { Restaurant, Reservation, MonthlyFlow, Invoice } from "../types/dashboard"

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "La Bella Vista",
    address: "Calle Principal 123, Madrid",
    phone: "+34 91 123 4567",
    capacity: 80,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "El Jardín Secreto",
    address: "Avenida de la Paz 456, Barcelona",
    phone: "+34 93 987 6543",
    capacity: 60,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Mariscos del Puerto",
    address: "Puerto Deportivo 789, Valencia",
    phone: "+34 96 555 0123",
    capacity: 120,
    status: "inactive",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export const reservations: Reservation[] = [
  {
    id: "1",
    restaurantId: "1",
    restaurantName: "La Bella Vista",
    customerName: "María García",
    customerEmail: "maria@email.com",
    customerPhone: "+34 600 123 456",
    date: "2024-01-20",
    time: "20:00",
    guests: 4,
    status: "confirmed",
    specialRequests: "Mesa junto a la ventana",
  },
  {
    id: "2",
    restaurantId: "2",
    restaurantName: "El Jardín Secreto",
    customerName: "Carlos López",
    customerEmail: "carlos@email.com",
    customerPhone: "+34 600 987 654",
    date: "2024-01-21",
    time: "19:30",
    guests: 2,
    status: "pending",
  },
  {
    id: "3",
    restaurantId: "1",
    restaurantName: "La Bella Vista",
    customerName: "Ana Martínez",
    customerEmail: "ana@email.com",
    customerPhone: "+34 600 555 777",
    date: "2024-01-22",
    time: "21:00",
    guests: 6,
    status: "confirmed",
    specialRequests: "Celebración de cumpleaños",
  },
]

export const monthlyFlow: MonthlyFlow[] = [
  { month: "Ene", visitors: 1200, reservations: 180, revenue: 15000 },
  { month: "Feb", visitors: 1350, reservations: 200, revenue: 18000 },
  { month: "Mar", visitors: 1100, reservations: 165, revenue: 14500 },
  { month: "Abr", visitors: 1450, reservations: 220, revenue: 19500 },
  { month: "May", visitors: 1600, reservations: 240, revenue: 22000 },
  { month: "Jun", visitors: 1800, reservations: 280, revenue: 25000 },
]

export const invoices: Invoice[] = [
  {
    id: "INV-001",
    restaurantId: "1",
    restaurantName: "La Bella Vista",
    amount: 1250.0,
    date: "2024-01-15",
    status: "paid",
    dueDate: "2024-02-15",
    items: [{ description: "Comisión por reservas", quantity: 50, unitPrice: 25.0, total: 1250.0 }],
  },
  {
    id: "INV-002",
    restaurantId: "2",
    restaurantName: "El Jardín Secreto",
    amount: 980.0,
    date: "2024-01-10",
    status: "pending",
    dueDate: "2024-02-10",
    items: [{ description: "Comisión por reservas", quantity: 40, unitPrice: 24.5, total: 980.0 }],
  },
]
