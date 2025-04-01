import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PcMilerService } from '../../services/pc-miler.service';
import { Truck, TruckService } from '../../services/truck.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-truck-search',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './truck-search.component.html',
})
export class TruckSearchComponent implements OnInit {
  truckSearchForm: FormGroup;
  trucks: Truck[] = [];
  filteredTrucks: any[] = [];
  loading: boolean = false;
  error: string = '';
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private truckService: TruckService,
    private pcMiler: PcMilerService
  ) {
    this.truckSearchForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      searchRadius: [300, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Load trucks from the TruckService.
    this.truckService.getTrucks().subscribe((data) => {
      this.trucks = data;
    });
  }

  // Convenience getters for form controls
  get pickupLocationControl() {
    return this.truckSearchForm.get('pickupLocation');
  }

  get searchRadiusControl() {
    return this.truckSearchForm.get('searchRadius');
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.truckSearchForm.invalid) {
      return;
    }
    this.searchTrucks();
  }

  /**
   * Searches for trucks within the specified radius based on ground miles calculated using PC*MILER.
   * Uses RxJS forkJoin to combine observables.
   */
  searchTrucks(): void {
    const { pickupLocation, searchRadius } = this.truckSearchForm.value;
    this.loading = true;
    this.error = '';

    const truckDistanceObservables = this.trucks.map((truck) =>
      this.pcMiler
        .getDrivingDistance(pickupLocation, truck.currentLocation)
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
          (truck) => truck.groundMiles <= searchRadius
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
