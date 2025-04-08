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
import { AdminNotificationsComponent } from './components/admin-notifications/admin-notifications.component';
import { BildirimlerComponent } from './components/bildirimler/bildirimler.component';
import { IlanlarAktifComponent } from './components/ilanlar-aktif/ilanlar-aktif.component';
import { IlanlarPasifComponent } from './components/ilanlar-pasif/ilanlar-pasif.component';
import { IlanKriterBasvuruComponent } from './components/ilan-kriter-basvuru/ilan-kriter-basvuru.component';
import { AdminKriterManagementComponent } from './components/admin-kriter-management/admin-kriter-management.component';
import { AdminEmailComponent } from './components/admin-email/admin-email.component';
import { AdminIlanManagementComponent } from './components/admin-ilan-management/admin-ilan-management.component';
import { AdminBasvuruDurumComponent } from './components/admin-basvuru-durum/admin-basvuru-durum.component';
import { IlanBasvuruComponent } from './components/ilan-basvuru/ilan-basvuru.component';
import { YoneticiComponent } from './components/yonetici/yonetici.component';
import { YoneticiIlanBasvuruComponent } from './components/yonetici-ilan-basvuru/yonetici-ilan-basvuru.component';
import { IlanBasvuruIncelemeComponent } from './components/ilan-basvuru-inceleme/ilan-basvuru-inceleme.component';
import { YoneticiIlanJuriComponent } from './components/yonetici-ilan-juri/yonetici-ilan-juri.component';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },

  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },

  // Profil sayfası için yönlendirmeler ve guardlar.
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuard] },
  {
    path: 'profiles/:id',
    component: ProfileComponent,
    canActivate: [LoginGuard, RoleGuard],
    data: { roles: ['admin', 'yonetici', 'juri'] },
  },
  { path: 'settings', component: SettingsComponent, canActivate: [LoginGuard] },
  {
    path: 'bildirimler',
    component: BildirimlerComponent,
    canActivate: [LoginGuard],
  },

  // Card Detail Sayfası
  { path: 'detail/:id', component: CardsDetailComponent },
  {
    path: 'ilan/basvuru/:id',
    component: IlanBasvuruComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'ilan/basvuru/inceleme/:id',
    component: IlanBasvuruIncelemeComponent,
    canActivate: [LoginGuard, RoleGuard],
    data: { roles: ['admin', 'yonetici', 'juri'] },  
  },

  { path: 'ilanlar/aktif', component: IlanlarAktifComponent },
  { path: 'ilanlar/gecmis', component: IlanlarPasifComponent },

  //Admin Dashboard
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'alan', component: AdminDepartmentManagementComponent },
      { path: 'role', component: AdminRoleManagementComponent },
      { path: 'users', component: AdminUserManagementComponent },
      { path: 'ilan/yonetim', component: AdminIlanManagementComponent },
      { path: 'ilan/ekle', component: CardsFormsComponent },
      { path: 'kriter', component: AdminKriterManagementComponent },
      { path: 'basvuru/durumlari', component: AdminBasvuruDurumComponent },
      { path: 'bildirim', component: AdminNotificationsComponent },
      { path: 'email', component: AdminEmailComponent },
    ],
    canActivate: [LoginGuard, RoleGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'yonetici',
    component: YoneticiComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'ilan/yonetim', component: AdminIlanManagementComponent },
      { path: 'ilan/ekle', component: CardsFormsComponent },
      { path: 'ilan/juri', component: YoneticiIlanJuriComponent},
      { path: 'ilan/basvurular', component: YoneticiIlanBasvuruComponent },
      { path: 'alan', component: AdminDepartmentManagementComponent },
      { path: 'basvuru/durumlari', component: AdminBasvuruDurumComponent },
      { path: 'kriter', component: AdminKriterManagementComponent },
      { path: 'bildirim', component: AdminNotificationsComponent },
      { path: 'email', component: AdminEmailComponent },
    ],
    canActivate: [LoginGuard, RoleGuard],
    data: { roles: ['admin', 'yonetici'] },
  },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'unauthorized' },
];
