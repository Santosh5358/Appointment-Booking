import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoctorProfile } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5000/api/doctor';
  private apiUrl2 = 'http://localhost:5000/api/doctorProfiles';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    console.log(email, password, "form data in service");
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  getDoctorProfile(): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(this.apiUrl);
  }

  getDoctorProfileById(doctorId: string): Observable<DoctorProfile> {
      return this.http.get<any>(`${this.apiUrl}/By?id=${doctorId}`);
  }

  updateDoctorProfile(profile: DoctorProfile): Observable<DoctorProfile> {
    return this.http.put<DoctorProfile>(this.apiUrl, profile);
  }

  addWorkSample(workSample: any): Observable<DoctorProfile> {
    return this.http.post<DoctorProfile>(`${this.apiUrl}/work-samples`, workSample);
  }

  removeWorkSample(sampleId: string): Observable<DoctorProfile> {
    return this.http.delete<DoctorProfile>(`${this.apiUrl}/work-samples/${sampleId}`);
  }

  // Doctors Management (for admin)
  getAllDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}/all`);
  }

  createDoctor(doctorData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, doctorData);
  }

  updateDoctor(doctorId: string, doctorData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl2}/all/${doctorId}`, doctorData);
  }

  deleteDoctor(doctorId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl2}/all/${doctorId}`);
  }
}
