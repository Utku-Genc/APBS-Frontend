import { Routes } from '@angular/router';

// Componentler 
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomepageComponent } from './components/homepage/homepage.component';

export const routes: Routes = [
    {path: '', redirectTo: 'homepage', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'homepage', component: HomepageComponent}
];
