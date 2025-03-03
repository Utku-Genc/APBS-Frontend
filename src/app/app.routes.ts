import { Routes } from '@angular/router';

// Componentler 
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginGuard } from './guards/login.guard';
import { ProfileGuard } from './guards/profile.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'homepage', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'homepage', component: HomepageComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [LoginGuard]},
    {path: 'profile/:id', component: ProfileComponent, canActivate: [ProfileGuard]},

    {path: 'settings', component: SettingsComponent, canActivate: [LoginGuard]},
];
