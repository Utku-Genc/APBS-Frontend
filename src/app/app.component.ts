import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'APBS-Frontend';
}
