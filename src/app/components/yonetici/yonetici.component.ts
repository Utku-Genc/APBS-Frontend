import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

declare var $: any;

@Component({
  selector: 'utk-yonetici',
  imports: [RouterModule, CommonModule],
  templateUrl: './yonetici.component.html',
  styleUrl: './yonetici.component.css',
})
export class YoneticiComponent implements OnInit, OnDestroy, AfterViewInit {
  // Sidebar state
  private readonly SIDEBAR_STATE_KEY = 'dashboard_menu';
  isSidebarCollapsed = false;
  isMobileView = false;
  isMobileMenuOpen = false;
  userRole: string | null = null;

  // Navigation
  activeRoute: string = 'dashboard';
  pageTitle: string = 'Dashboard';

  // Subscriptions
  private routerSubscription?: Subscription;
  private authService = inject(AuthService);

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit() {
    // Load sidebar state from localStorage
    this.loadSidebarState();

    // Listen for route changes
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveRoute(event.urlAfterRedirects);

        // Close mobile menu after navigation
        if (this.isMobileView) {
          this.closeMobileMenu();
        }
      });

    // Initial route setup
    this.updateActiveRoute(this.router.url);

    // Check screen size on init
    this.checkScreenSize();
    this.userRole = this.authService.getUserRole();
  }

  ngAfterViewInit() {
    this.initTooltips();

    // Watch for sidebar state changes to reinitialize tooltips
    this.watchSidebarChanges();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Handle responsive design
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    this.initTooltips();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth < 992;
    this.isMobileView = isMobile;

    // On desktop
    if (!isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  // Load sidebar state from localStorage
  private loadSidebarState() {
    try {
      const savedState = localStorage.getItem(this.SIDEBAR_STATE_KEY);
      if (savedState !== null) {
        this.isSidebarCollapsed = JSON.parse(savedState);
      }
      // If no saved state is found, the default (false - expanded) will be used
    } catch (error) {
      console.error('Error loading sidebar state:', error);
      // Use default state if there's an error
    }
  }

  // Save sidebar state to localStorage
  private saveSidebarState() {
    try {
      localStorage.setItem(
        this.SIDEBAR_STATE_KEY,
        JSON.stringify(this.isSidebarCollapsed)
      );
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  }

  toggleSidebar() {
    if (this.isMobileView) {
      // For mobile - toggle the visibility of the sidebar
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    } else {
      // For desktop - toggle the collapsed state
      this.isSidebarCollapsed = !this.isSidebarCollapsed;

      // Save the state to localStorage whenever it changes
      this.saveSidebarState();

      // Re-initialize tooltips after toggling
      setTimeout(() => {
        this.initTooltips();
      }, 300); // Wait for sidebar animation to complete
    }
  }

  closeMobileMenu() {
    if (this.isMobileView) {
      this.isMobileMenuOpen = false;
    }
  }

  // Initialize tooltips
  private initTooltips() {
    // If you're using jQuery/Bootstrap
    if (typeof $ !== 'undefined') {
      // Destroy existing tooltips first
      $('[data-toggle="tooltip"]').tooltip('dispose');

      // Only enable tooltips when sidebar is collapsed and not in mobile view
      if (this.isSidebarCollapsed && !this.isMobileView) {
        $('[data-toggle="tooltip"]').tooltip();
      }
    } else {
      // Alternative approach if not using jQuery
      // This might require additional work with the Renderer2
      console.log('jQuery not available, using alternative tooltip approach');
      // Implement custom tooltip initialization if needed
    }
  }

  // Watch for sidebar state changes
  private watchSidebarChanges() {
    // This is a simple approach - for more complex scenarios,
    // you might want to use BehaviorSubject or other state management
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Sidebar class changed, reinitialize tooltips
          setTimeout(() => {
            this.initTooltips();
          }, 300);
        }
      });
    });

    // Get the sidebar element
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true });
    }
  }

  // Update active route and page title
  private updateActiveRoute(url: string) {
    if (url.includes('/yonetici/')) {
      this.activeRoute = url.split('/yonetici/')[1];
      this.updatePageTitle();
    }
  }

  private updatePageTitle() {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      'ilan/yonetim': 'İlan Yönetimi',
      'ilan/ekle': 'İlan Ekle',
      alan: 'Alan ve Bölüm',
      kriter: 'Kriter Yönetimi',
      bildirim: 'Bildirimler',
      email: 'E-posta Yönetimi',
    };

    this.pageTitle = titles[this.activeRoute] || 'Dashboard';
  }
}
