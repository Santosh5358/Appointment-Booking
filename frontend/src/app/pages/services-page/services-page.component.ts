import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/index';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css']
})
export class ServicesPageComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  selectedCategory = '';
  loading = true;
  errorMessage = '';
  successMessage = '';
  categories = ['Physiotherapy', 'Acupuncture', 'Acupressure'];

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        this.filteredServices = data;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.errorMessage = 'Failed to load services. Please try again later.';
        setTimeout(() => this.errorMessage = '', 3000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === '') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(s => s.category === category);
    }
  }
}
