import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'app/services/firebase.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'app/services/firebase.login.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';


@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  oobCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, private http: HttpClient,
          private notificationService: NotificationService,
    private firebaseService: LoginService
  ) {}

  // ngOnInit(): void {
  //   // Extract the oobCode from the URL query parameters.
  //   // this.route.queryParams.subscribe(params => {
  //   //   this.oobCode = params['oobCode'] || '';
  //   //   if (!this.oobCode) {
  //   //     alert('Invalid password reset link.');
  //   //     this.router.navigate(['/login']);
  //   //   }
  //   // });
  // }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.notificationService.showNotification('Invalid password reset link.', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.showNotification('Passwords do not match!', 'warning');
      return;
    }
    this.http.post('/api/resetPassword', { token: this.token, newPassword: this.newPassword })
      .subscribe(
        (res: any) => {
          this.notificationService.showNotification(res.message, 'success');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error(error);
          this.notificationService.showNotification(error.error?.error || 'An error occurred.', 'error');
        }
      );
  }


  // async onResetPassword(): Promise<void> {
  //   if (this.newPassword !== this.confirmPassword) {
  //     alert('Passwords do not match!');
  //     return;
  //   }

  //   try {
  //     // Call the Firebase service to reset the password and update Firestore with the hashed password.
  //     await this.firebaseService.resetPasswordWithHash(this.oobCode, this.newPassword);
  //     alert('Password updated successfully!');
  //     this.router.navigate(['/login']);
  //   } catch (error) {
  //     console.error('Error resetting password:', error);
  //     alert('Error resetting password: ' + (error as Error).message);
  //   }
  // }
}