import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ServiceService } from '../../services/service.service';
import { DoctorService } from '../../services/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { Service, Booking } from '../../models/index';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
  bookingForm!: FormGroup;
  services: Service[] = [];
  doctors: any[] = [];
  availableSlots: { time: string; isBooked: boolean }[] = [];
  submitted = false;
  loading = false;
  doctorsLoading = false;
  successMessage = '';
  errorMessage = '';
  minDate!: string;
  doctorServicesMap: { [doctorId: string]: Service[] } = {};
  servicesForSelectedDoctor: Service[] | undefined;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private serviceService: ServiceService,
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.loadDoctors();
    this.initializeForm();
    this.setMinDate();
    this.bookingForm.get('doctor')?.valueChanges.subscribe(() => {
    this.onDoctorChange();
});

  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      patientEmail: ['', [Validators.required, Validators.email]],
      patientPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      patientAddress: ['', [Validators.required, Validators.minLength(5)]],
      service: ['', Validators.required],
      doctor: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      notes: ['']
    });
  }
    loadServices(): void {
  this.serviceService.getAllServices().subscribe({
    next: (data) => {
      this.services = data;

      // Build doctor -> services map
      this.doctorServicesMap = {};
      this.services.forEach(s => {
        if (!this.doctorServicesMap[s.doctor]) {
          this.doctorServicesMap[s.doctor] = [];
        }
        this.doctorServicesMap[s.doctor].push(s);
      });

      // Optional: check for serviceId query param
      this.route.queryParams.subscribe(params => {
        if (params['serviceId']) {
          this.bookingForm.patchValue({ service: params['serviceId'] });
        }
      });
    },
    error: (err) => {
      this.errorMessage = 'Failed to load services';
      setTimeout(() => this.errorMessage = '', 5000);
      console.error('Failed to load services', err);
    }
  });
}

    

    getDoctorServices(doctorId: string): string {
        const services = this.doctorServicesMap[doctorId] || [];
        return services.map(s => s.name).join(', ');
    }

  buildDoctorServicesMap(): void {
    this.doctorServicesMap = {};
    this.doctors.forEach(doc => {
      this.doctorServicesMap[doc._id] = this.services.filter(s => s.doctor === doc._id);
    });
  }
  
  loadDoctors(): void {
  this.doctorsLoading = true;
  this.doctorService.getAllDoctors().subscribe({
    next: (data) => {
      this.doctors = data;
      this.buildDoctorServicesMap();
        console.log('Doctors loaded:', this.doctors);
      // Map services to doctors
      this.doctors.forEach(doc => {
        this.doctorServicesMap[doc._id] = this.services.filter(s => s.doctor === doc._id);
      });

      this.doctorsLoading = false;
    },
    error: (error) => {
      console.error('Error loading doctors:', error);
      this.errorMessage = 'Failed to load doctors';
      this.doctorsLoading = false;
      setTimeout(() => this.successMessage = '', 3000);
    }
  });
}
    onDoctorChange(): void {
        this.bookingForm?.get('appointmentDate')?.setValue(null);
        const doctorId = this.bookingForm?.get('doctor')?.value;
        if (doctorId) {
          this.servicesForSelectedDoctor = this.doctorServicesMap[doctorId] || [];
          // Reset selected service if it's not valid
          const currentService = this.bookingForm.get('service')?.value;
          if (!this.servicesForSelectedDoctor.find(s => s._id === currentService)) {
            this.bookingForm.patchValue({ service: '' });
          }
        } else {
          this.servicesForSelectedDoctor = [];
          this.bookingForm.patchValue({ service: '' });
        }
}

  onServiceChange(): void {
    const doctorId = this.bookingForm.get('doctor')?.value;
    const selectedServiceId = this.bookingForm.get('service')?.value;
    if (!doctorId) {
        alert('Please select a doctor to view their services.');
        this.bookingForm.get('service')?.setValue('service');
        return;
    }
  }

  onDateChange(): void {
    const selectedDate = this.bookingForm.get('appointmentDate')?.value;
    const doctorId = this.bookingForm.get('doctor')?.value;
    if (selectedDate && doctorId) {
      this.bookingService.getAvailableSlots(doctorId, selectedDate).subscribe({
        next: (data) => {
          // Convert slots to include booking status
          this.availableSlots = data.allSlots.map((slot: string) => ({
            time: slot,
            isBooked: data.bookedSlots.includes(slot)
          }));
        },
        error: (error) => {
          this.errorMessage = 'Failed to load available slots';
          setTimeout(() => this.errorMessage = '', 5000);
          this.availableSlots = [];
        }
      });
    } else {
        this.bookingForm.get('appointmentDate')?.setValue(null);
        alert('Please select both doctor and date to view available slots.');

    }
  }

  isSlotDisabled(slot: { time: string; isBooked: boolean }): boolean {
    return slot.isBooked;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.bookingForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    // Check if selected slot is booked
    const selectedTime = this.bookingForm.get('appointmentTime')?.value;
    const selectedSlot = this.availableSlots.find(s => s.time === selectedTime);
    
    if (selectedSlot && selectedSlot.isBooked) {
      this.errorMessage = 'This time slot is already booked. Please select another time.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const booking = this.bookingForm.value;
    booking.appointmentDate = new Date(booking.appointmentDate);

    this.bookingService.createBooking(booking).subscribe({
      next: (response) => {
        this.successMessage = 'Appointment booked successfully! We will confirm your booking soon.';
        this.bookingForm.reset();
        this.submitted = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error booking appointment:', error);
        this.errorMessage = error.error?.message || 'Failed to book appointment. Please try again.';
        setTimeout(() => this.errorMessage = '', 5000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get f() {
    return this.bookingForm.controls;
  }
}
