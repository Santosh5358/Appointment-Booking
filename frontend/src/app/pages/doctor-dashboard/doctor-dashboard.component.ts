import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { DoctorService } from '../../services/doctor.service';
import { Booking } from '../../models/index';
import { Router } from '@angular/router';
declare var bootstrap: any;


@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  // Authentication
  isLoggedIn = false;
  doctorPassword = '';
  passwordForm!: FormGroup;
  passwordSubmitted = false;
  emailsubmitted = false;
  isMenuOpen = false;
  completeForm!: FormGroup;
  selectedBooking: any;
  selectedFile!: File;
  formOPened = false;
  loading = false;

  
  // Dashboard tabs
  activeTab: 'bookings' | 'profile' = 'bookings';

  // Bookings   
  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  bookingStatus = 'all'; // 'all', 'pending', 'confirmed', 'completed', 'cancelled'

  // Profile
  doctorProfile: any = null;
  profileForm!: FormGroup;
  profileSubmitted = false;
  profileLoading = false;
  profileSuccessMessage = '';
  profileErrorMessage = '';

  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private doctorService: DoctorService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if (!this.checkIfLoggedIn()) {
      this.initializePasswordForm();
    }
    this.completeForm = this.fb.group({
    problem: ['', Validators.required],
    diagnosis: ['', Validators.required],
    instructions: ['', Validators.required]
  });

  }

  openCompleteModal(booking: any): void {
  this.selectedBooking = booking;
  console.log('Selected Booking for completion:', this.selectedBooking);
  // this.completeForm.reset(); 
  this.formOPened = true 
;
}
closeCompleteModal(): void {
  this.formOPened = false;
  this.completeForm.reset();
  this.selectedFile = undefined!;
}



  initializePasswordForm(): void {
  this.passwordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],  // add this
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
}


  checkIfLoggedIn(): boolean {
    const auth_token = localStorage.getItem('auth_token');
    if (auth_token) {
      this.isLoggedIn = true;
      this.loadAllBookings();
      this.loadDoctorProfile();
      return true;
    }
    return false;
  }
    @ViewChild('profileSection') profileSection!: ElementRef;
  scrollToProfile(): void {
    setTimeout(() => {
          this.profileSection?.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
  }

  onPasswordSubmit(): void {
    this.emailsubmitted = true;
    this.passwordSubmitted = true;

    
    if (this.passwordForm.invalid ) {
      this.errorMessage = 'Please enter a valid Email and password';
      return;
    }

    const enteredEmail = this.passwordForm.get('email')?.value;
    const enteredPassword = this.passwordForm.get('password')?.value;
    // Call backend for authentication
    this.doctorService.login(enteredEmail,enteredPassword).subscribe({
      next: (response: any) => {
      if (response) {
        this.isLoggedIn = true;
        localStorage.setItem('auth_token', response.auth_token);
        localStorage.setItem('doctorId', response.doctor._id);
        localStorage.setItem('user_role', 'doctor');
        this.errorMessage = '';
        this.loadAllBookings();
        this.loadDoctorProfile();
        this.scrollToProfile();
      } else {
        this.errorMessage = 'Invalid response from server';
      }
      },
      error: (error) => {
      console.error('Login error:', error);
      this.errorMessage = 'Invalid password. Please try again.';
      }
    });
  }

  onFileSelect(event: any): void {
  this.selectedFile = event.target.files[0];
}

  submitCompletion(): void {
  if (this.completeForm.invalid || !this.selectedBooking) return;
  this.loading = true;

  const formData = new FormData();
  formData.append('problem', this.completeForm.value.problem);
  formData.append('diagnosis', this.completeForm.value.diagnosis);
  formData.append('instructions', this.completeForm.value.instructions);
  formData.append('status', 'completed');

  if (this.selectedFile) {
    formData.append('prescription', this.selectedFile);
  }

  this.bookingService.updateBookingStatus(this.selectedBooking._id, formData)
    .subscribe({
      next: () => {
        this.successMessage = 'Appointment completed successfully';
        this.loadAllBookings();
        this.loading = false;
        this.formOPened = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to complete appointment';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
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
    localStorage.clear();
    this.passwordForm.reset();
    this.passwordSubmitted = false;
    this.errorMessage = '';
  }

  // Bookings Methods
  loadAllBookings(): void {
    this.loading = true;
    const doctorId = localStorage.getItem('doctorId');
    if (doctorId) {
        this.bookingService.getBookingById(doctorId).subscribe({
        next: (data) => {
            this.allBookings = Array.isArray(data) ? data : [data];
            this.filterBookings();
            this.loading = false;
        },
        error: (error) => {
            console.error('Error loading bookings:', error);
            this.errorMessage = 'Failed to load bookings';
            this.loading = false;
        }
        });
    }
}

  filterBookings(): void {
    if (this.bookingStatus === 'all') {
      this.filteredBookings = this.allBookings;
    } else {
      this.filteredBookings = this.allBookings.filter(
        booking => booking.status === this.bookingStatus
      );
    }
  }

  onStatusFilterChange(): void {
    this.filterBookings();
  }

  updateBookingStatus(bookingId: string, newStatus: string): void {
    this.bookingService.updateBookingStatus2(bookingId, newStatus).subscribe({
      next: () => {
        this.successMessage = 'Booking status updated successfully';
        this.loadAllBookings();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating booking:', error);
        this.errorMessage = 'Failed to update booking status';
      }
    });
  }

  deleteBooking(bookingId: string): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.successMessage = 'Booking deleted successfully';
          this.loadAllBookings();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          this.errorMessage = 'Failed to delete booking';
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    }
  }

  // Profile Methods
  loadDoctorProfile(): void {
    const doctorid = localStorage.getItem('doctorId') || '';
    this.doctorService.getDoctorProfileById(doctorid).subscribe({
      next: (data) => {
        this.doctorProfile = data;
        this.initializeProfileForm();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.profileErrorMessage = 'Failed to load profile';
        setTimeout(() => this.successMessage = '', 3000);
      }
    });
  }

  initializeProfileForm(): void {
    this.profileForm = this.fb.group({
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

  onProfileSubmit(): void {
    this.profileSubmitted = true;

    if (this.profileForm.invalid) {
      this.profileErrorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.profileLoading = true;
    const formValue = this.profileForm.value;
    
    // Convert specializations string to array
    const profileData = {
      ...formValue,
      specializations: formValue.specializations.split(',').map((s: string) => s.trim())
    };

    this.doctorService.updateDoctorProfile(profileData).subscribe({
      next: (data) => {
        this.doctorProfile = data;
        this.profileSuccessMessage = 'Profile updated successfully!';
        this.profileErrorMessage = '';
        this.profileLoading = false;
        this.profileSubmitted = false;
        setTimeout(() => this.profileSuccessMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.profileErrorMessage = 'Failed to update profile';
        setTimeout(() => this.successMessage = '', 3000);
        this.profileLoading = false;
      }
    });
  }

  switchTab(tab: 'bookings' | 'profile'): void {
    this.activeTab = tab;
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

  get pf() {
    return this.profileForm.controls;
  }
}
