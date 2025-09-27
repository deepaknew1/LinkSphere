// network.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  checkConnectivity(): boolean {
    return navigator.onLine;
  }
}
