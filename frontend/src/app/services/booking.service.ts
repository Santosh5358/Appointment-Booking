import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) { }

  createBooking(booking: Booking): Observable<any> {
    return this.http.post(`${this.apiUrl}`, booking);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getBookingsByEmail(email: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/by-email/${email}`);
  }

  updateBookingStatus(id: string, data: FormData) {
  return this.http.post(
    `${this.apiUrl}/${id}/complete`,
    data
  );
}

  updateBookingStatus2(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }



  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAvailableSlots(doctorId: string, date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/available-slots/?doctorId=${doctorId}&date=${date}`);
  }
}
