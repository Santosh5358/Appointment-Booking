import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isloggedIn = false;
  isDoctorLoggedIn = false;
  constructor(private router: Router) { 
    this.checkDoctorLogin();
    this.router.events.subscribe(() => {
      localStorage.hasOwnProperty('auth_token') ? this.isloggedIn = true : this.isloggedIn = false;
    });
  }

   checkDoctorLogin(): void {
    const role = localStorage.getItem('user_role');
    this.isDoctorLoggedIn = role === 'doctor';
  }

  ngOnInit(): void {
    // localStorage.getItem('auth_token') ? this.isloggedIn = true : this.isloggedIn = false;
    // console.log('Navbar init - isloggedIn:', this.isloggedIn);
    // console.log('auth_token:', localStorage.getItem('auth_token'));
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isloggedIn = false;
    this.router.navigate(['/home']);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }
}
