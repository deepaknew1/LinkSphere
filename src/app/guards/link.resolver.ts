// import { Injectable } from '@angular/core';
// import { Resolve } from '@angular/router';
// import { LinkService } from 'app/services/firebase.link.service';
// import { Observable, from, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class LinkResolver implements Resolve<any> {
//   constructor(private linkService: LinkService) {}

//   resolve(): Observable<any> {
//     // Convert Promise to Observable using `from`
//     return from(this.linkService.fetchLinks()).pipe(
//       catchError((error) => {
//      //   console.error('Error fetching links:', error);
//         return of([]); // Return an empty array on error
//       })
//     );
//   }
// }
