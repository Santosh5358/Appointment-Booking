import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { DoctorService } from '../../services/doctor.service';
import { Service, DoctorProfile } from '../../models/index';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ServiceCardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  services: Service[] = [];
  doctorProfile: DoctorProfile | null = null;
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private serviceService: ServiceService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.loadDoctorProfile();
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services = data.slice(0, 6); // Display first 6 services
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.errorMessage = 'Failed to load Data. Please try again later.';
        setTimeout(() => this.errorMessage = '', 3000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadDoctorProfile(): void {
  this.doctorService.getDoctorProfile().subscribe({
    next: (data: any) => {
      console.log('Doctor profiles loaded:', data);

      // ✅ If API returns array → take first item
      if (Array.isArray(data) && data.length > 0) {
        this.doctorProfile = data[0];
      } else {
        this.doctorProfile = data; // fallback if API returns single object
      }
    },
    error: (error) => {
      console.error('Error loading doctor profile:', error);

    }
  });
}

}
