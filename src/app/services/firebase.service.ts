import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth, fetchSignInMethodsForEmail, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, reload } from 'firebase/auth';
import { NotificationService } from 'app/authentication/notification.service';
import bcrypt from 'bcryptjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
 
 
  private app;
  private db;
  private auth;

  constructor(
    private notificationService: NotificationService
  ) {
    // Initialize Firebase
    const apps = getApps();
    if (apps.length > 0) {
      this.app = apps[0];
   //   console.log('Using existing Firebase app');
    } else {
      this.app = initializeApp(environment.firebaseConfig);
     // console.log('Initialized new Firebase app', this.app);
    }

    // Initialize Firestore and Auth instances
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  // Check network connectivity
  checkConnectivity(): boolean {
    return navigator.onLine;
  }

 
  async registerUser(user: { name: string; emailOrMobile: string; password: string }): Promise<{ success: boolean; message: string }> {
    if (!this.checkConnectivity()) {
      this.notificationService.showNotification('No network connection!', 'error');
      return { success: false, message: 'No network connection' };
    }
  
    try {
      // Check if the user already exists based on email or phone number
      const userCollection = collection(this.db, 'users');
      const querySnapshot = await getDocs(userCollection);
      const userExists = querySnapshot.docs.some((doc: any) => {
        const userData = doc.data() as { emailOrMobile: string };
        return userData.emailOrMobile === user.emailOrMobile;
      });
  
      if (userExists) {
        this.notificationService.showNotification('User already exists with this email', 'error');
        return { success: true, message: 'User already exists with this email' };
      }
  
      const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds for bcrypt

      // Create user with email/password in Firebase
      const userCredential = await createUserWithEmailAndPassword(this.auth, user.emailOrMobile, user.password);
  
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        this.notificationService.showNotification('Verification email sent. Please verify your email.', 'warning');
  
        // Check for email verification in a controlled manner
        const maxAttempts = 10; // Set a max number of attempts to check email verification
        let attempts = 0;
  
        while (attempts < maxAttempts) {
          await userCredential.user.reload(); // Reload the user to get the latest status
          if (userCredential.user.emailVerified) {
            // Save user data in Firestore after email verification
            const registrationData = {
              name: user.name,
              emailOrMobile: user.emailOrMobile,
              uid: userCredential.user.uid,
              createdUserDate: new Date().toISOString(),
              password: hashedPassword,  
            };
  
            await addDoc(userCollection, registrationData);
            this.notificationService.showNotification('User registered and email verified successfully!', 'success');
            return { success: true, message: 'User registered and email verified successfully' };
          }
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
  
        // If email is not verified after max attempts
        return { success: false, message: 'Email verification failed. Please try again later.' };
      }
  
      // Fallback if userCredential.user is undefined or an error occurs
      return { success: false, message: 'Failed to create user. Please try again later.' };
    } catch (err) {
    //  console.error('Error registering user: ', err);
  
      // Ensure 'err' is treated as a Firebase error
      const error = err as { code: string };
  
      // Handle specific errors for better feedback
      if (error.code === 'auth/email-already-in-use') {
        this.notificationService.showNotification('Email is already in use. Please Login.', 'error');
        return { success: true, message: 'Email is already in use' };
      } else if (error.code === 'auth/invalid-email') {
        this.notificationService.showNotification('Invalid email address. Please provide a valid email.', 'error');
        return { success: false, message: 'Invalid email address' };
      } else {
        this.notificationService.showNotification('Registration failed. Please try again later.', 'error');
        return { success: false, message: 'Registration failed. Please try again later' };
      }
    }
  }
  

  // Initialize Firebase auth listener (if needed)
  initializeAuthListener() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
       // console.log('User logged in:', user);
      } else {
      //  console.log('User logged out');
      }
    });
  }

  getDbInstance() {
    return this.db;
  }
}
 
 
 
 
 
 
 
 
 
 
 
 