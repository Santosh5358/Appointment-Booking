import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Service } from '../../models/index';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent {
  @Input() service!: Service;

  constructor(private router: Router) { }

  bookService(): void {
    this.router.navigate(['/booking'], { queryParams: { serviceId: this.service._id } });
  }
}
