import { Routes } from '@angular/router';

// Componentler 
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginGuard } from './guards/login.guard';
import { GuestGuard } from './guards/guest.guard';
import { CardsDetailComponent } from './components/cards.detail/cards.detail.component';
import { AdminDashboardComponent } from './components/admin.dashboard/admin.dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { CardsFormsComponent } from './components/cards.forms/cards.forms.component';

export const routes: Routes = [
    {path: '', redirectTo: 'homepage', pathMatch: 'full'},
    {path: 'homepage', component: HomepageComponent},

    {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},


    // Profil sayfası için yönlendirmeler ve guardlar.
    {path: 'profile', component: ProfileComponent, canActivate: [LoginGuard]},
    {path: 'profile/:id', component: ProfileComponent},
    {path: 'settings', component: SettingsComponent, canActivate: [LoginGuard]},

    // Card Detail Sayfası
    {path: 'detail/:id', component: CardsDetailComponent},
    {path: 'ilan/ekle', component: CardsFormsComponent},


    //Admin Dashboard
    {
        path: 'admin',
        component: AdminComponent,
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
      },
];
