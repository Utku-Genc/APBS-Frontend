import { Component } from '@angular/core';

@Component({
  selector: 'utk-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Menu states
  mobileMenuActive = false;
  profileMenuActive = false;
  mobileProfileMenuActive = false;

  // Toggle methods
  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  toggleProfileMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

  toggleMobileProfileMenu() {
    this.mobileProfileMenuActive = !this.mobileProfileMenuActive;
  }
}
