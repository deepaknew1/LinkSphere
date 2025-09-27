// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { catchError, Observable, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class LinkService1 {
//   private addLinkUrl = 'http://localhost:5000/addlink'; // API endpoint to add links
//   private getLinksUrl = 'http://localhost:5000/getlinks'; // API endpoint to fetch links

//   constructor(private http: HttpClient) {}

//   // Add Link Method
//   addLink(linkData: { personName: string; socialMedia: string; socialMediaLink: string;  }): Observable<any> {
//     const token = this.getToken();
  
//     if (!token) {
//       console.error('Token is missing. Please log in first.');
//       return throwError('Authentication token is missing.');
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     return this.http.post('http://localhost:5000/addlink', linkData, { headers }).pipe(     
//       catchError((error) => {
//       //  console.error('Error while adding link:', error);
//         return throwError(error);
//       })
//     );
//   }


//   fetchLinks(): Observable<{ links: any[] }> {
//     const token = this.getToken();
//     if (!token) {
//       console.error('Token is missing. Please log in first.');
//       return throwError('Authentication token is missing.');
//     }
  
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get<{ links: any[] }>(this.getLinksUrl, { headers }).pipe(
//       catchError((error) => {
//         console.error('Error while fetching links:', error);
//         return throwError(error);
//       })
//     );
//   }
//     // Helper method to get token from localStorage
//   private getToken(): string | null {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       return localStorage.getItem('token');
//     }
//     console.error('localStorage is not available');
//     return null;
//   }
// }
