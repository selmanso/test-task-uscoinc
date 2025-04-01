import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PcMilerService } from '../../services/pc-miler.service';
import { Truck, TruckService } from '../../services/truck.service';

@Component({
  selector: 'app-truck-search',
  templateUrl: './truck-search.component.html',
})
export class TruckSearchComponent implements OnInit {
  pickupLocation: string = '';
  searchRadius: number = 300;
  trucks: Truck[] = [];
  filteredTrucks: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private truckService: TruckService,
    private pcMiler: PcMilerService
  ) {}

  ngOnInit(): void {
    // Load trucks from the TruckService.
    this.truckService.getTrucks().subscribe((data) => {
      this.trucks = data;
    });
  }

  /**
   * Searches for trucks within the specified radius based on ground miles calculated using PC*MILER.
   * Uses RxJS forkJoin to combine observables.
   */
  searchTrucks(): void {
    if (!this.pickupLocation) {
      this.error = 'Please enter a pick-up location.';
      return;
    }
    this.loading = true;
    this.error = '';

    const truckDistanceObservables = this.trucks.map((truck) =>
      this.pcMiler
        .getDrivingDistance(this.pickupLocation, truck.currentLocation)
        .pipe(
          map((distance) => ({ ...truck, groundMiles: distance })),
          catchError((err) => {
            console.error(
              `Error fetching distance for truck ${truck.name}:`,
              err
            );
            return of(null);
          })
        )
    );

    forkJoin(truckDistanceObservables).subscribe(
      (trucksWithDistance) => {
        const validTrucks = trucksWithDistance.filter(
          (truck) => truck !== null
        );
        this.filteredTrucks = validTrucks.filter(
          (truck) => truck.groundMiles <= this.searchRadius
        );
        this.filteredTrucks.sort((a, b) => a.groundMiles - b.groundMiles);
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.error = 'Error calculating distances. Please try again later.';
        this.loading = false;
      }
    );
  }
}
