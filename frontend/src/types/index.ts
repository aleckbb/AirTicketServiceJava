export interface User {
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airplaneModel: string;
  price: number;
}

export interface Booking {
  id: number;
  flightId: number;
  seatNumber: string;
  flight: Flight;
}

export interface BookingRequest {
  flightId: number;
  seatNumber: string;
}