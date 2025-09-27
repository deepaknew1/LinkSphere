import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// import { FirebaseService } from 'app/services/firebase.service';
import { getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FirebaseService } from 'app/services/firebase.service';
import { environment } from 'environments/environment';

@Component({
  standalone:true,
  imports:[ReactiveFormsModule,FormsModule,RouterModule,CommonModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user = {
    name: '',
    emailOrMobile: '',
    password: '',
    confirmPassword: ''
  };

  private app;
  private db;
  private auth;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Toggle password visibility for the Password field
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Toggle password visibility for the Confirm Password field
  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor( private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private firebaseService : FirebaseService
  ) {
      const apps = getApps();
        if (apps.length > 0) {
          // Use existing app if initialized
          this.app = apps[0];
        //  console.log('Using existing Firebase app');
        } else {
         
          this.app = initializeApp(environment.firebaseConfig);
          
        }
    
        // Initialize Firestore and Auth instances  9875379283
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);

  }
  async registerUser() {
    if (this.user.password !== this.user.confirmPassword) {
      this.notificationService.showNotification('Passwords do not match!', 'error');
      return;
    }

    const registrationData = {
      name: this.user.name,
      emailOrMobile: this.user.emailOrMobile,
      password: this.user.password
    };

    // console.log(registrationData);
    // this.firebaseService.registerUser(registrationData);


    const result = await this.firebaseService.registerUser(registrationData);
    if (result.success) {
      this.router.navigate(['/login']); // Redirect to login page
    } else {
     // console.error('Registration failed:', result.message);
    }
    
  }

  checkFirebaseConnection1() {
    const auth = getAuth();
   // console.log('Firebase Auth instance:', auth);
  //  alert('Firebase connection is working.');
  }


  ngOnInit() {
  //  console.log("listinging ngonit");
    this.firebaseService.initializeAuthListener();
  }

  // Method to add user data
  checkFirebaseConnection() {
  
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  
}
