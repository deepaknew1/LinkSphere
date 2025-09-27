import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'app/services/firebase.login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(): boolean {
    // Directly check if the user is logged in based on the token in localStorage


    if (this.loginService.isLoggedIn()) {
      
      return true;
    } else {
      // Redirect to login page if the user is not logged in
      this.router.navigate(['/login']);
      return false;
    }
  }
}
