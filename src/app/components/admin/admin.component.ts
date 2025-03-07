import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'utk-admin',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
private router= inject(Router);
menuOpen: boolean = false; // Menü açma durumu
pageTitle: string = 'Dashboard';  // Varsayılan başlık


  navigateTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
