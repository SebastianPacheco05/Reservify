import type {
  Restaurant,
  Reservation,
  MonthlyFlow,
  Invoice,
} from "../types/dashboard";

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "La Bella Vista",
    location: "Centro Histórico",
    cuisine: "Italiana",
    rating: 4.8,
    totalTables: 25,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export const reservations: Reservation[] = [
  {
    id: "1",
    restaurantId: "1",
    restaurantName: "La Bella Vista",
    customerName: "María González",
    customerEmail: "maria@email.com",
    date: "2024-01-20",
    time: "19:30",
    guests: 4,
    status: "confirmed",
    tableNumber: 12,
  },
];

export const monthlyFlow: MonthlyFlow[] = [
  { month: "Ene", visitors: 400, reservations: 180, revenue: 2000 },
  { month: "Feb", visitors: 1350, reservations: 210, revenue: 52500 },
  { month: "Mar", visitors: 1180, reservations: 165, revenue: 41250 },
  { month: "Abr", visitors: 1420, reservations: 225, revenue: 56250 },
  { month: "May", visitors: 1680, reservations: 280, revenue: 70000 },
  { month: "Jun", visitors: 1850, reservations: 320, revenue: 80000 },
  { month: "Jul", visitors: 2100, reservations: 380, revenue: 95000 },
  { month: "Ago", visitors: 1950, reservations: 340, revenue: 85000 },
  { month: "Sep", visitors: 1750, reservations: 290, revenue: 72500 },
  { month: "Oct", visitors: 1600, reservations: 250, revenue: 62500 },
  { month: "Nov", visitors: 1400, reservations: 220, revenue: 55000 },
  { month: "Dec", visitors: 1800, reservations: 300, revenue: 75000 },
];

export const invoices: Invoice[] = [
  {
    id: "1",
    restaurantId: "1",
    restaurantName: "La Bella Vista",
    amount: 2500,
    date: "2024-01-15",
    status: "paid",
    dueDate: "2024-01-30",
    invoiceNumber: "INV-2024-001",
  },
  {
    id: "2",
    restaurantId: "2",
    restaurantName: "Sakura Sushi",
    amount: 1800,
    date: "2024-01-10",
    status: "pending",
    dueDate: "2024-01-25",
    invoiceNumber: "INV-2024-002",
  },
  {
    id: "3",
    restaurantId: "3",
    restaurantName: "El Asador",
    amount: 3200,
    date: "2024-01-05",
    status: "overdue",
    dueDate: "2024-01-20",
    invoiceNumber: "INV-2024-003",
  },
];
