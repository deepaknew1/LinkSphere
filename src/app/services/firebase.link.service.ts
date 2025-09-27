import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, query, where, getDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { NotificationService } from 'app/authentication/notification.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private app: any;
  private db: Firestore;
  private auth: Auth;

  constructor(private notificationService: NotificationService) {
    // Initialize Firebase
    const apps = getApps();
    if (apps.length > 0) {
      this.app = apps[0];
    } else {
     
      this.app = initializeApp(environment.firebaseConfig);

    }

    // Initialize Firestore and Auth instances
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  async addLink(linkData: { personName: string; socialMedia: string; socialMediaLink: string }): Promise<boolean> {
    try {
    //  console.log("in the method");
      const currentUser = this.auth.currentUser;
  
      if (!currentUser) {
        //console.log("add link service");
        this.notificationService.showNotification('User not authenticated.', 'error');
        throw new Error('User not authenticated.');
        
      }
  
      const uid = currentUser.uid;
  
      // Fetch existing links
      const links = await this.fetchLinks(); // Assuming fetchLinks is updated to return the links
  
      if (links.length >= 100) {
        this.notificationService.showNotification('You have exceeded the maximum limit of 4 links.', 'warning');
        return false; // Prevent adding more links if limit is exceeded
      }
  
      const linkCollection = collection(this.db, 'links');
      const payload = {
        ...linkData,
        uid,
        timestamp: new Date().toISOString(),
      };
  
      await addDoc(linkCollection, payload);
      this.notificationService.showNotification('Link added successfully.', 'success');
      return true;
    } catch (error) {
     // console.error('Error adding link:', error);
      this.notificationService.showNotification('Failed to add link.', 'error');
      return false;
    }
  }

  async fetchLinks(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, async (user: User | null) => {
        if (!user) {
         // console.log("link sefffffrvice");
          this.notificationService.showNotification('User not authenticated.', 'error');
          reject(new Error('User not authenticated.'));
          return;
        }

        try {
          const uid = user.uid;
          const linkCollection = collection(this.db, 'links');
          const q = query(linkCollection, where('uid', '==', uid));
          const querySnapshot = await getDocs(q);

          const links = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
          resolve(links);
        } catch (error) {
          //console.error('Error fetching links:', error);
          this.notificationService.showNotification('Failed to fetch links.', 'error');
          reject(error);
        }
      });
    });
  }


  getRecords(): Observable<any[]> {
    const linkCollection = collection(this.db, 'links');
    return new Observable((observer) => {
      getDocs(linkCollection)
        .then((querySnapshot) => {
          const records = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          observer.next(records);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
 
  async deleteRecord(id: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'links', id);
      await deleteDoc(docRef);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete record with ID: ${id}. Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while deleting the record.');
      }
    }
  }  

}
