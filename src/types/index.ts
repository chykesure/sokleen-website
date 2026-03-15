export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  address: string;
  rooms: number;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  valueProposition: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface PriceEstimate {
  rooms: number;
  bathrooms: number;
  squareMeters: number;
  serviceType: string;
}
