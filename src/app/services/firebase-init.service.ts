// firebase-init.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseInitService {
  private app;
  private db;
  private auth;

  constructor() {
    const apps = getApps();
    if (apps.length > 0) {
      this.app = apps[0];
    } else {
        this.app = initializeApp(environment.firebaseConfig);
    }

    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  getDb() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }
}
