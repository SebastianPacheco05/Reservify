export interface Restaurant {
  /** UUID del restaurante (rutas /data-owner/restaurantes/{uid}). */
  id: string
  /** NIT; las reservas por restaurante del dueño siguen filtrando por nit. */
  nit: number
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

export interface DailyFlow {
  hour: string
  customers: number
  reservations: number
  walkIns: number
}

export interface ClienteGestor {
  documento: number
  nombre: string
  email: string
  total_reservas: number
  ultima_visita: string
}

export interface MiBalanceFactura {
  id_encab_fact: number
  nit: number
  nombre_restaurante: string
  precio_total: number
  fecha: string
}

export interface MiBalanceResponse {
  total: number
  facturas: MiBalanceFactura[]
}

export interface MiRestauranteInfo {
  restaurante_uid: string
  nit: number
  nombre_restaurante: string
  direccion: string
  horario_apertura: string
  horario_cierre: string
  url_image: string
  /** Antelación mínima para reservar (en horas). 0 = sin restricción. */
  min_anticipacion_horas?: number
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
