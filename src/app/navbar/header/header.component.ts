import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'app/services/firebase.login.service';
import { getAuth, signOut } from 'firebase/auth';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public isLoggedIn: boolean = false; // To determine if the user is logged in
  private username: string | null = null;    // To display the logged-in user's name
  isReady: boolean = false; 
  constructor(private router: Router, public loginService: LoginService, private cdr: ChangeDetectorRef,private zone: NgZone  ) {}
  private usernameSubscription!: Subscription;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Initialize collapsible element
    const collapsibleElement = document.getElementById('navbarNav');
    if (collapsibleElement) {
      const collapse = new bootstrap.Collapse(collapsibleElement, {
        toggle: false,
      });
    }
    
    this.subscriptions.push(
      this.loginService.loggedInObservable.subscribe((status) => {
        this.zone.run(() => {
          this.isLoggedIn = status;
          this.cdr.detectChanges(); // Reflect changes in the UI
        });
      })
    );

    // Subscribe to usernameObservable
    this.subscriptions.push(
      this.loginService.usernameObservable.subscribe((username) => {
        this.zone.run(() => {
          this.username = username;
          this.cdr.detectChanges(); // Ensure that changes are reflected immediately
        });
      })
    );
  

  // Check and load the stored username from localStorage (if available)
 
}

  ngAfterViewInit(): void {
    const collapsibleElement = document.getElementById('navbarNav');
    if (collapsibleElement) {
      const collapse = new bootstrap.Collapse(collapsibleElement, {
        toggle: false,
      });
    }    
  } 

  async  logout() {
    const auth = getAuth();
    //await signOut(auth);
    this.loginService.logout(); // Call the updated logout in the service
   
    this.username = null; // Reset the username in the header
    this.isLoggedIn = false; // Reset the login status
    localStorage.removeItem('username');
    localStorage.removeItem('token');
localStorage.removeItem('isLoggedIn');

this.router.navigate(['/login']);


  }

}