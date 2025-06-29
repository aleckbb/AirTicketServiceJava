import {Booking, BookingRequest, Flight, LoginRequest, RegisterRequest} from "../types";

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {

  private token: string | null = localStorage.getItem('auth_token')

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return {} as T;
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<void> {
    await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // после успешной регистрации – сразу логинимся
    await this.login({ email: data.email, password: data.password });
  }

  async login(data: LoginRequest): Promise<void> {
    // ожидаем, что бэкенд вернёт { token: string }
    const result = await this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.token = result.token;
    localStorage.setItem('auth_token', this.token);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Flight methods
  async getFlights(): Promise<Flight[]> {
    return this.request<Flight[]>('/flights');
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/bookings');
  }

  async getAvailableSeats(flightId: number): Promise<string[]> {
    return this.request<string[]>(`/bookings/available-seats/${flightId}`);
  }

  async bookSeat(data: BookingRequest): Promise<void> {
    await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: number): Promise<void> {
    await this.request(`/bookings/${id}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();