import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { DoctorService } from '../../services/doctor.service';
import { DoctorProfile } from '../../models/index';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  contactForm!: FormGroup;
  doctorProfile: DoctorProfile | null = null;
  submitted = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDoctorProfile();
  }

  initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadDoctorProfile(): void {
    this.doctorService.getDoctorProfile().subscribe({
      next: (data) => {
        this.doctorProfile = data;
      },
      error: (error) => {
        console.error('Error loading doctor profile:', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.contactService.sendContact(this.contactForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Thank you for contacting us. We will get back to you soon!';
        this.contactForm.reset();
        this.submitted = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.errorMessage = 'Failed to send message. Please try again later.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get f() {
    return this.contactForm.controls;
  }
}
