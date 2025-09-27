import { Routes, Router } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
// import { AuthService } from './authentication/auth.service';
// import { LinkResolver } from './guards/link.resolver';
import { LoginService } from './services/firebase.login.service';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./authentication/login/login.component').then(m => m.LoginComponent),  
    canActivate: [NoAuthGuard], 
  },
  // {
  //   path: 'forgot',
  //   loadComponent: () => import('./authentication/forgot/forgot.component').then(m => m.ForgotComponent),
  //   canActivate: [NoAuthGuard],
  // },
  //  { path: 'reset-password',
  //    loadComponent: () => import('./authentication/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  //    canActivate: [NoAuthGuard],
  //  },
  { 
    path: 'register', 
    loadComponent: () => import('./authentication/register/register.component').then(m => m.RegisterComponent), 
    canActivate: [NoAuthGuard], 
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
    // resolve: { links: LinkResolver }, 
  },
  {
    path: 'addLink',
    loadComponent: () => import('./home/add-link/add-link.component').then(m => m.AddLinkComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full'  // Redirect root URL to login
  },

  {
    path: '**',
    redirectTo: '/login'  // Wildcard route to catch undefined paths and redirect to login
  }
];

export class AppRoutingModule {
  constructor(private authService: LoginService, private router: Router) {
    // Adjust the wildcard route to redirect based on authentication status
    this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        // Check if user is logged in and redirect accordingly
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
