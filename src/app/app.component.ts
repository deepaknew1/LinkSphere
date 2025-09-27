import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FooterComponent } from './navbar/footer/footer.component';
import { HeaderComponent } from './navbar/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for HTTP requests

import { environment } from '../environments/environment';
// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { LoginService } from './services/firebase.login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [LoginService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
 // isLoggedIn: boolean = false;
  username: string | null = null;

  firebaseConfig: any;
  loggedInSubscription: Subscription = new Subscription();
  usernameSubscription: Subscription = new Subscription();

  constructor(private router: Router, public loginService: LoginService, private http: HttpClient) {
    //this.auth.updateUserInfo();
  }
  ngOnInit(): void {
    // Get the username from the LoginService or localStorage
    this.username = this.loginService.getStoredUsername();

    // Alternatively, you can get it from localStorage directly:
    // this.username = localStorage.getItem('username');
  }

}
