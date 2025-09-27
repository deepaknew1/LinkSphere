import { Component } from '@angular/core';
// import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { Router } from 'express';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../notification.service';
import { LoginService } from 'app/services/firebase.login.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss'
})
export class ForgotComponent {
  emailOrMobile: string = '';  // Bind to the input field
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private loginService: LoginService,
    private http: HttpClient,
      private notificationService: NotificationService, private router: Router) {}


      // onForgotPassword(): void {
      //   if (this.emailOrMobile) {
      //     this.loginService.sendNewPassword(this.emailOrMobile).subscribe(
      //       (response) => {
      //         this.successMessage = 'Password sent to your email. Please log in.';
      //         setTimeout(() => {
      //           // Navigate to login page after success
      //           this.successMessage = '';
      //           // Use Angular's Router for navigation
      //           window.location.href = '/login'; // Or use router.navigate() method
      //         }, 2000);
      //       },
      //       (error) => {
      //         this.errorMessage = error.error.message || 'Something went wrong. Please try again.';
      //       }
      //     );
      //   }
      // }
      // onForgotPassword() {
      //   if (!this.emailOrMobile) {
      //     this.notificationService.showNotification('Please enter your email.', 'warning');
      //     return;
      //   }
      //   this.http.post('/api/requestPasswordReset', { email: this.emailOrMobile }).subscribe(
      //     (res: any) => {
      //       this.notificationService.showNotification(res.message, 'success');
      //       this.router.navigate(['/login']);
      //     },
      //     (error) => {
      //       console.error(error);
      //       this.notificationService.showNotification(error.error?.error || 'An error occurred.', 'error');
      //     }
      //   );
      // }

  
  // Submit the form to request a password reset
  async onForgotPassword(): Promise<void> {
    if (this.emailOrMobile) {
      try {
        await this.loginService.checkAndSendPasswordReset(this.emailOrMobile);
        this.notificationService.showNotification('Password reset link sent to your email.', 'success');
      } catch (error: any) {
        this.notificationService.showNotification(error.message || 'An error occurred. Please try again later.', 'error');
      }
    } else {
      this.notificationService.showNotification('Please enter your email.', 'warning');
    }
  }
  
}
