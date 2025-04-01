import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Truck {
  id: number;
  name: string;
  currentLocation: string; // Example: full address
}

@Injectable({
  providedIn: 'root',
})
export class TruckService {
  // Sample truck data. Replace or retrieve from your backend as needed.
  private trucks: Truck[] = [
    { id: 1, name: 'Truck A', currentLocation: '123 Main St, Sacramento, CA' },
    { id: 2, name: 'Truck B', currentLocation: '456 Oak Ave, Roseville, CA' },
    { id: 3, name: 'Truck C', currentLocation: '789 Pine Rd, Davis, CA' },
    // Add more trucks as required.
  ];

  getTrucks(): Observable<Truck[]> {
    return of(this.trucks);
  }
}
