import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'app/services/firebase.login.service';
@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Redirect logged-in users to home or any other page
      this.router.navigate(['/home']);
      return false; // Prevent navigation to login/register pages
    }
    return true; // Allow navigation to login/register pages
  }
}
