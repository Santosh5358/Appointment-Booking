import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  doctorName = 'Dr. Physiotherapy Clinic';
  currentYear = new Date().getFullYear();

  constructor(private doctorService: DoctorService) { }
}
