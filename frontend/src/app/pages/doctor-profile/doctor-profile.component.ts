import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DoctorProfile } from '../../models/index';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctorProfile: DoctorProfile | null = null;
  loading = true;
  doctorProfile2: DoctorProfile | null = null;
  operatingHours: any;

  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.loadDoctorProfile();
    this.opratingHours();
  }


  opratingHours(): void {
    this.operatingHours = {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '09:00', end: '14:00' },
        sunday: { start: 'Closed', end: 'Closed' },
      }
  }

@ViewChild('profileSection') profileSection!: ElementRef;
   
  changeDoctor(doctor: DoctorProfile): void {
     this.doctorProfile = doctor;

  // Wait for DOM to render, then scroll
  setTimeout(() => {
    this.profileSection?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
    }

  loadDoctorProfile(): void {
    this.loading = true;
    const doctorID= localStorage.getItem('doctorID') || '';
    this.doctorService.getDoctorProfileById(doctorID).subscribe({
      next: (data) => {
        this.doctorProfile2 = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctor profile:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

