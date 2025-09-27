import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Add FormsModule import here
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification.service';
// import { FirebaseLoginService } from 'app/services/firebase.login.service';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from 'app/services/firebase.service';
import { LoginService } from 'app/services/firebase.login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],  // Include FormsModule in imports for standalone component
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';  // Will be used for email or phone
  password: string = '';
  errorMessage: string = '';  // To store error messages
  isLoggedIn: boolean = false; 
  showPassword: boolean = false;  // Controls password visibility


  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) {
    const apps = getApps();
    // Initialize app if not already initialized
   
  }

    // Function to toggle the show/hide of the password field
    toggleShowPassword(): void {
      this.showPassword = !this.showPassword;
    }
  

  // Login method
  async onLogin() {
    if (!this.username || !this.password) {
      this.notificationService.showNotification('Please enter both email/phone number and password.', 'error');
      return;
    }

    try {
      const isPasswordCorrect = await this.loginService.comparePasswords(this.password, this.username);
      if (isPasswordCorrect) {     
        this.notificationService.showNotification('Login Successful.', 'success');        
         this.router.navigate(['/home']); // Navigate to home after successful login       
      } else {
        this.notificationService.showNotification('Invalid credentials! Please try again.', 'error');
      }
    } catch (error) {
      this.errorMessage = 'An error occurred, please try again later.';
      this.notificationService.showNotification(this.errorMessage, 'error');
    }
  }

  // Handle navigation to register page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
