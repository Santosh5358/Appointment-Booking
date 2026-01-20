import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ServiceService } from '../../services/service.service';
import { DoctorService } from '../../services/doctor.service';
import { Service, Booking } from '../../models/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // Authentication
  isLoggedIn = false;
  adminPassword = '';
  passwordForm!: FormGroup;
  passwordSubmitted = false;

  // Dashboard tabs
  activeTab: 'dashboard' | 'bookings' | 'doctor' | 'doctors' | 'services' | 'settings' = 'dashboard';

  // Dashboard Stats
  totalBookings = 0;
  pendingBookings = 0;
  confirmedBookings = 0;
  services: Service[] = [];
  recentBookings: Booking[] = [];

  // Bookings Management
  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  bookingStatusFilter = 'all';
  bookingLoading = false;

  // Doctor Profile Management
  doctorProfile: any = null;
  doctorForm!: FormGroup;
  doctorSubmitted = false;
  doctorLoading = false;
  doctorSuccessMessage = '';
  doctorErrorMessage = '';

  // Doctors Management
  allDoctors: any[] = [];
  doctorsList: any[] = [];
  doctorsForm!: FormGroup;
  doctorsSubmitted = false;
  doctorsLoading = false;
  doctorsSuccessMessage = '';
  doctorsErrorMessage = '';
  editingDoctorId: string | null = null;

  // Services Management
  serviceForm!: FormGroup;
  serviceSubmitted = false;
  serviceLoading = false;
  serviceSuccessMessage = '';
  serviceErrorMessage = '';
  editingServiceId: string | null = null;

  // Settings
  settingsForm!: FormGroup;
  settingsSubmitted = false;
  settingsLoading = false;
  settingsSuccessMessage = '';
  settingsErrorMessage = '';

  // General Messages
  successMessage = '';
  errorMessage = '';
  isMenuOpen= false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private doctorService: DoctorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializePasswordForm();
    this.checkIfLoggedIn();
  }

  initializePasswordForm(): void {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  checkIfLoggedIn(): void {
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword === 'admin123') {
      this.isLoggedIn = true;
      this.loadDashboardData();
    }
  }

  onPasswordSubmit(): void {
    this.passwordSubmitted = true;
    
    if (this.passwordForm.invalid) {
      this.errorMessage = 'Please enter a valid password';
      return;
    }

    const enteredPassword = this.passwordForm.get('password')?.value;
    
    if (enteredPassword === 'admin123') {
      this.isLoggedIn = true;
      localStorage.setItem('adminPassword', enteredPassword);
      localStorage.setItem('auth_token', 'dummy_token_for_demo'); 
      this.errorMessage = '';
      this.loadDashboardData();
    } else {
      this.errorMessage = 'Invalid password. Please try again.';
    }
  }

   navigate(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('adminPassword');
    localStorage.clear
    this.passwordForm.reset();
    this.passwordSubmitted = false;
    this.errorMessage = '';
  }

  // Dashboard Methods
  loadDashboardData(): void {
    this.loadBookings();
    this.loadServices();
    this.loadDoctorProfile();
    this.loadDoctors();
  }

  loadBookings(): void {
    this.bookingLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.allBookings = data;
        this.recentBookings = data.slice(0, 5);
        this.totalBookings = data.length;
        this.pendingBookings = data.filter(b => b.status === 'pending').length;
        this.confirmedBookings = data.filter(b => b.status === 'confirmed').length;
        this.filterBookings();
        this.bookingLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.bookingLoading = false;
      }
    });
  }

  loadServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  loadDoctorProfile(): void {
    this.doctorService.getDoctorProfile().subscribe({
      next: (data) => {
        this.doctorProfile = data;
        this.initializeDoctorForm();
      },
      error: (error) => {
        console.error('Error loading doctor profile:', error);
      }
    });
  }

  // Bookings Methods
  filterBookings(): void {
    if (this.bookingStatusFilter === 'all') {
      this.filteredBookings = this.allBookings;
    } else {
      this.filteredBookings = this.allBookings.filter(
        b => b.status === this.bookingStatusFilter
      );
    }
  }

  onBookingFilterChange(): void {
    this.filterBookings();
  }

  updateBookingStatus(bookingId: string, newStatus: string): void {
    this.bookingService.updateBookingStatus(bookingId, newStatus).subscribe({
      next: () => {
        this.successMessage = 'Booking status updated successfully';
        this.loadBookings();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Failed to update booking';
      }
    });
  }

  deleteBooking(bookingId: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.successMessage = 'Booking deleted successfully';
          this.loadBookings();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Failed to delete booking';
        }
      });
    }
  }

  // Doctor Profile Methods
  initializeDoctorForm(): void {
    this.doctorForm = this.fb.group({
      name: [this.doctorProfile?.name || '', [Validators.required, Validators.minLength(3)]],
      title: [this.doctorProfile?.title || '', Validators.required],
      email: [this.doctorProfile?.email || '', [Validators.required, Validators.email]],
      phone: [this.doctorProfile?.phone || '', [Validators.required, Validators.pattern(/^\+?\d{10,}$/)]],
      address: [this.doctorProfile?.address || '', [Validators.required, Validators.minLength(5)]],
      experience: [this.doctorProfile?.experience || '', [Validators.required, Validators.min(0)]],
      bio: [this.doctorProfile?.bio || '', Validators.required],
      specializations: [this.doctorProfile?.specializations?.join(', ') || '', Validators.required],
    });
  }

  onDoctorSubmit(): void {
    this.doctorSubmitted = true;

    if (this.doctorForm.invalid) {
      this.doctorErrorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.doctorLoading = true;
    const formValue = this.doctorForm.value;
    
    const profileData = {
      ...formValue,
      specializations: formValue.specializations.split(',').map((s: string) => s.trim())
    };

    this.doctorService.updateDoctorProfile(profileData).subscribe({
      next: (data) => {
        this.doctorProfile = data;
        this.doctorSuccessMessage = 'Doctor profile updated successfully!';
        this.doctorErrorMessage = '';
        this.doctorLoading = false;
        this.doctorSubmitted = false;
        setTimeout(() => this.doctorSuccessMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.doctorErrorMessage = 'Failed to update profile';
        this.doctorLoading = false;
      }
    });
  }

  // Services Methods
  initializeServiceForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      doctor: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(15)]],
      category: ['', Validators.required]  
    });
  }

  onServiceSubmit(): void {
    this.serviceSubmitted = true;

    if (this.serviceForm.invalid) {
      this.serviceErrorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.serviceLoading = true;
    const formValue = this.serviceForm.value;

    if (this.editingServiceId) {
      // Update existing service
      this.serviceService.updateService(this.editingServiceId, formValue).subscribe({
        next: () => {
          this.serviceSuccessMessage = 'Service updated successfully!';
          this.serviceErrorMessage = '';
          this.serviceLoading = false;
          this.serviceSubmitted = false;
          this.editingServiceId = null;
          this.serviceForm.reset();
          this.loadServices();
          setTimeout(() => this.serviceSuccessMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.serviceErrorMessage = 'Failed to update service';
          this.serviceLoading = false;
        }
      });
    } else {
      // Create new service
      this.serviceService.createService(formValue).subscribe({
        next: () => {
          this.serviceSuccessMessage = 'Service created successfully!';
          this.serviceErrorMessage = '';
          this.serviceLoading = false;
          this.serviceSubmitted = false;
          this.serviceForm.reset();
          this.loadServices();
          setTimeout(() => this.serviceSuccessMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.serviceErrorMessage = 'Failed to create service';
          this.serviceLoading = false;
        }
      });
    }
  }

  editService(service: Service): void {
    this.editingServiceId = service._id || null;
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration
    });
    window.scrollTo(0, 0);
  }

  cancelEditService(): void {
    this.editingServiceId = null;
    this.serviceForm.reset();
    this.serviceSubmitted = false;
  }

  deleteService(serviceId: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceService.deleteService(serviceId).subscribe({
        next: () => {
          this.successMessage = 'Service deleted successfully';
          this.loadServices();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Failed to delete service';
        }
      });
    }
  }

  // Doctors Management Methods
  loadDoctors(): void {
    this.doctorsLoading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.allDoctors = data;
        this.doctorsList = data;
        this.doctorsLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.doctorsErrorMessage = 'Failed to load doctors';
        this.doctorsLoading = false;
      }
    });
  }

  initializeDoctorsForm(): void {
    this.doctorsForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      experience: ['', [Validators.required, Validators.min(0)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      specializations: ['', Validators.required],
    });
  }

  onDoctorsSubmit(): void {
    this.doctorsSubmitted = true;

    if (this.doctorsForm.invalid) {
      this.doctorsErrorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.doctorsLoading = true;
    const formValue = this.doctorsForm.value;
    
    const doctorData = {
      ...formValue,
      specializations: formValue.specializations.split(',').map((s: string) => s.trim())
    };

    if (this.editingDoctorId) {
      // Update existing doctor
      this.doctorService.updateDoctor(this.editingDoctorId, doctorData).subscribe({
        next: () => {
          this.doctorsSuccessMessage = 'Doctor updated successfully!';
          this.doctorsErrorMessage = '';
          this.doctorsLoading = false;
          this.doctorsSubmitted = false;
          this.editingDoctorId = null;
          this.doctorsForm.reset();
          this.loadDoctors();
          setTimeout(() => this.doctorsSuccessMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.doctorsErrorMessage = 'Failed to update doctor';
          this.doctorsLoading = false;
        }
      });
    } else {
      // Create new doctor
      this.doctorService.createDoctor(doctorData).subscribe({
        next: () => {
          this.doctorsSuccessMessage = 'Doctor added successfully!';
          this.doctorsErrorMessage = '';
          this.doctorsLoading = false;
          this.doctorsSubmitted = false;
          this.doctorsForm.reset();
          this.loadDoctors();
          setTimeout(() => this.doctorsSuccessMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.doctorsErrorMessage = 'Failed to add doctor';
          this.doctorsLoading = false;
        }
      });
    }
  }

  editDoctor(doctor: any): void {
    this.editingDoctorId = doctor._id || null;
    this.doctorsForm.patchValue({
      title: doctor.title,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      address: doctor.address,
      experience: doctor.experience,
      bio: doctor.bio,
      specializations: doctor.specializations?.join(', ') || ''
    });
    window.scrollTo(0, 0);
  }

  cancelEditDoctor(): void {
    this.editingDoctorId = null;
    this.doctorsForm.reset();
    this.doctorsSubmitted = false;
  }

  deleteDoctor(doctorId: string): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(doctorId).subscribe({
        next: () => {
          this.successMessage = 'Doctor deleted successfully';
          this.loadDoctors();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Failed to delete doctor';
        }
      });
    }
  }

  // Tab Navigation
  switchTab(tab: 'dashboard' | 'bookings' | 'doctor' | 'doctors' | 'services' | 'settings'): void {
    this.activeTab = tab;
    if (tab === 'services' && !this.serviceForm) {
      this.initializeServiceForm();
    }
    if (tab === 'doctors' && !this.doctorsForm) {
      this.initializeDoctorsForm();
      this.loadDoctors();
    }
  }

  getServiceName(service: any): string {
    if (service && typeof service === 'object') {
      return service.name || 'Unknown';
    }
    return service || 'Unknown';
  }

  getDoctorName(doctor: any): string {
    if (doctor && typeof doctor === 'object') {
      return `${doctor.title || ''} ${doctor.name || 'Unknown'}`.trim();
    }
    return doctor || 'Not Assigned';
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch(status) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-success';
      case 'completed': return 'bg-info';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  get f() {
    return this.passwordForm.controls;
  }

  get df() {
    return this.doctorForm?.controls || {};
  }

  get sf() {
    return this.serviceForm?.controls || {};
  }

  get docf() {
    return this.doctorsForm?.controls || {};
  }
}
