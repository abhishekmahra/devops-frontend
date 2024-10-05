import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';


@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  
  reservations: Reservation[] = []
  
  constructor(private reservationService: ReservationService){}

  ngOnInit(): void {
      this.reservationService.getReservations().subscribe({
        next: (reservations: Reservation[]) => { this.reservations = reservations;
        },
        error: (err)=>{
          console.error('Error fetching reservations', err);
          alert('Failed to fetch reservations')
        }
      })
    }

  deleteReservation(_id: string): void{
    this.reservationService.deleteReservation(_id).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(reservation => reservation._id !== _id);
        alert('Reservation deleted successfully')
      },
      error: (err)=>{
        console.error('Error deleting reservation', err);
        alert('Failed to delete reservation, please try again');
      }
    });
  }
}
