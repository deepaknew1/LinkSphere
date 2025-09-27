import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, from } from 'rxjs';
import { query, where, getDocs, collection, updateDoc, doc, getFirestore } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { FirebaseService } from './firebase.service'; // Import FirebaseService
import { confirmPasswordReset, getAuth, onAuthStateChanged, onIdTokenChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, verifyPasswordResetCode } from 'firebase/auth'; // Import Firebase authentication
import { getApps, initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
 
  private app;
  private db;
  private auth;
  private loggedInSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isLoggedIn') === 'true' || false
  );
  // private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedInObservable = this.loggedInSubject.asObservable(); // Expose as observable

  private usernameSubject = new BehaviorSubject<string | null>(this.getStoredUsername());
  public usernameObservable = this.usernameSubject.asObservable();

 // private isLoggedIn: boolean = false;
  private username: string | null = null;


  constructor(private firebaseservice: FirebaseService,private http: HttpClient) {
    const apps = getApps();
        if (apps.length > 0) {
          this.app = apps[0];
        } else {
            this.app = initializeApp(environment.firebaseConfig);
        }
    
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
  }


  // Compare entered password with the hashed password
  async comparePasswords(enteredPassword: string, emailOrPhone: string): Promise<boolean> {
  //  console.log('Fetching credentials from Firestore...');

    try {
      // Create a query to filter the users collection based on emailOrMobile
      const usersRef = collection(this.firebaseservice.getDbInstance(), "users");
      const q = query(usersRef, where("emailOrMobile", "==", emailOrPhone));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
       // console.log('No matching user found');
        return false; // User not found
      }
//console.log("user found ")
      let storedHashedPassword: string | null = null;
      let userEmailOrMobile: string | null = null;

      let username: string | null = null;

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        storedHashedPassword = userData["password"];
        userEmailOrMobile = userData["emailOrMobile"];
        username=userData["name"];
      });
   if (storedHashedPassword) {
        // Compare the entered password with the stored hashed password
        const isMatch = await new Promise<boolean>((resolve, reject) => {
          bcrypt.compare(enteredPassword, storedHashedPassword, (err: Error | null, isMatch: boolean) => {
            if (err) {
              reject(err);
            } else {
               /// saveUsername(username);
              resolve(isMatch);
            }
          });
        });

        if (isMatch) {
       const auth = getAuth();
          try {
            const userCredential = await signInWithEmailAndPassword(auth, userEmailOrMobile!, enteredPassword);
            const token = await userCredential.user.getIdToken(); // Firebase token
            this.saveToken(token);
            localStorage.setItem('isLoggedIn', 'true')
            this.saveUsername(username || ''); // Save username
            this.loggedInSubject.next(true); 
            console.log('BehaviorSubject updated: Logged in status set to true');
            console.log('Initial loggedInSubject value:', this.loggedInSubject.getValue());

            // console.log("login",username);
            // console.log("login", localStorage.getItem('isLoggedIn'));
           
            return true;
          } catch (error) {
           // console.error('Firebase auth error:', error);
            return false; // If there's an error with Firebase login
          }
        } else {
         // console.log('Password does not match');
          return false; // Password mismatch
        }
      } else {
       // console.log('No password found');
        return false; // No password found
      }
    } catch (error) {
      ///console.error('Error fetching user:', error);
      throw error; // Rethrow the error so it can be handled by the caller
    }
  }

  
  async checkAndSendPasswordReset(email: string): Promise<void> {
    try {
      // 1. Check if the email exists in the 'users' collection.
      const usersRef = collection(this.firebaseservice.getDbInstance(), 'users');
      const q = query(usersRef, where('emailOrMobile', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Email does not exist. Please register.');
      }

      // Assume we update the first matching document.
      const userDoc = querySnapshot.docs[0];

      // 2. Generate a new 9-digit password.
      const newPassword = Math.floor(100000000 + Math.random() * 900000000).toString();

      // 3. Hash the new password.
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 4. Update the Firestore user document with the new hashed password.
      await updateDoc(doc(this.firebaseservice.getDbInstance(), 'users', userDoc.id), {
        password: hashedPassword
      });
      
      const cloudFunctionUrl = 'https://handlepasswordreset-vfkt4pmyfa-uc.a.run.app';
      await firstValueFrom(
        this.http.post<any>(cloudFunctionUrl, 
          
          
          { email },
          {
            headers: {
              'Content-Type': 'application/json',
              // Content-Length will be auto-calculated by Angular
            }
          }
        )
      );

      console.log('New password generated and email sent:', newPassword);
    } catch (error) {
      throw error;
    }
  }


  getStoredUsername(): string | null {
    return localStorage.getItem('username');
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public setLoggedInStatus(status: boolean): void {
    this.loggedInSubject.next(status); // This allows you to set the status from outside
  }

  public saveUsername(username: string): void {
    localStorage.setItem('username', username);
    this.usernameSubject.next(username);
  }


  private removeToken(): void {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

async  logout() {
   // signOut(auth).then(() => {
    // Update reactive state
    this.loggedInSubject.next(false);
    this.usernameSubject.next(null);
    this.username = null;

  }

  
  // Method to fetch username from Firestore using UID
  private async fetchUsernameFromFirestore(uid: string): Promise<string> {
    try {
      const usersRef = collection(this.firebaseservice.getDbInstance(), "users");
      const q = query(usersRef, where("uid", "==", uid)); // Query Firestore by user UID
      const querySnapshot = await getDocs(q);
  
      // Log if no matching user is found
      if (querySnapshot.empty) {
      //  console.log("No matching user found in Firestore for UID:", uid);
        return ''; // Return empty string if user not found
      }
  
      let username: string | null = null;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
       // console.log("User data from Firestore:", userData);
        username = userData["name"]; // Assuming "name" is the field for username
      });
  
      return username || ''; // Return username or empty string if not found
    } catch (error) {
    //  console.error("Error fetching username from Firestore:", error);
      throw error; // Throw error to be handled by the calling function
    }
  }
}