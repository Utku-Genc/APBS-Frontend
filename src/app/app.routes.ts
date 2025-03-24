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
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AdminDepartmentManagementComponent } from './components/admin-department-management/admin-department-management.component';
import { AdminUserManagementComponent } from './components/admin-user-management/admin-user-management.component';
import { AdminRoleManagementComponent } from './components/admin-role-management/admin-role-management.component';

export const routes: Routes = [
    {path: '', redirectTo: 'homepage', pathMatch: 'full'},
    {path: 'homepage', component: HomepageComponent},

    {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},


    // Profil sayfası için yönlendirmeler ve guardlar.
    {path: 'profile', component: ProfileComponent, canActivate: [LoginGuard]},
    {path: 'profiles/:id', component: ProfileComponent, canActivate: [LoginGuard, RoleGuard], data: { roles: ['admin', 'yonetici', 'juri'] }},
    {path: 'settings', component: SettingsComponent, canActivate: [LoginGuard]},

    // Card Detail Sayfası
    {path: 'detail/:id', component: CardsDetailComponent},




    //Admin Dashboard
    {
        path: 'admin',
        component: AdminComponent,
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'alan', component: AdminDepartmentManagementComponent },
          {path: 'role', component: AdminRoleManagementComponent},
          { path: 'users', component: AdminUserManagementComponent }, 
          {path: 'ilan/ekle', component: CardsFormsComponent},
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
        canActivate: [LoginGuard, RoleGuard],
        data: { roles: ['admin'] }
      },


      { path: 'unauthorized', component: UnauthorizedComponent }, 
      { path: '**', redirectTo: 'unauthorized' }

];
