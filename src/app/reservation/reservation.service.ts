import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class ReservationService{

  private apiUrl = `${environment.apiUrl}/reservation`
    constructor(private http: HttpClient){}

    getReservations():Observable<Reservation[]>{
      return this.http.get<Reservation[]>(this.apiUrl) 
    }

    getReservation(id:string): Observable<Reservation>{
      return this.http.get<Reservation>(`${this.apiUrl}/${id}`)
    }

    addReservation(reservation: Reservation): Observable<Reservation>{
    console.log(reservation);
      return this.http.post<Reservation>(this.apiUrl, reservation)
    }

    updateReservation(id:string,reservation: Reservation): Observable<Reservation>{
      return this.http.patch<Reservation>(`${this.apiUrl}/${id}`, reservation)
    }

    deleteReservation(id:string):Observable<void>{
      return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}
