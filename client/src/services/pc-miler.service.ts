import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
  This service now calls your backend endpoint to retrieve the ground miles.
  Ensure your backend server is running (e.g., at http://localhost:3000).
*/
@Injectable({
  providedIn: 'root',
})
export class PcMilerService {
  // Updated backend endpoint URL
  private apiUrl = 'http://localhost:3000/api/computeDistance';

  constructor(private http: HttpClient) {}

  /**
   * Gets the driving distance (ground miles) between two addresses.
   * @param origin The starting address.
   * @param destination The destination address.
   * @returns Observable<number> representing the ground miles.
   */
  getDrivingDistance(origin: string, destination: string): Observable<number> {
    const params = { origin, destination };
    return this.http
      .get<{ groundMiles: number }>(this.apiUrl, { params })
      .pipe(map((response) => response.groundMiles));
  }
}
