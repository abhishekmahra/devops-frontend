import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  reservationForm: FormGroup = new FormGroup({})
  reservationId: string | null = null;

  constructor(private formBuilder: FormBuilder,
     private reservationService: ReservationService,
     private router: Router,
     private activatedRoute: ActivatedRoute){

  }


  ngOnInit(): void {
  this.reservationForm= this.formBuilder.group({
    checkInDate: ['',Validators.required],
    checkOutDate: ['',Validators.required],
    guestName:['',Validators.required],
    guestEmail:['',[Validators.required , Validators.email]],
    roomNumber:['',Validators.required],
  })
  //checking if theres an id in the parameters of my route for edit
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id')
    console.log(this.reservationId)
    
    if(this.reservationId){
      this.reservationService.getReservation(this.reservationId).subscribe({next:(reservation:Reservation)=>{
        this.reservationForm.patchValue({
          ...reservation,
            checkinDate: new Date(reservation.checkinDate).toISOString().split('T')[0], // Convert Date to input format (YYYY-MM-DD)
            checkoutDate: new Date(reservation.checkoutDate).toISOString().split('T')[0]  // Convert Date to input format (YYYY-MM-DD)
        })
        },
        error: (err)=>{
          console.error('Error fetching reservation', err)
        }
    });
  }
}

  onSubmit(){
    
    if(this.reservationForm.valid){

      const formValues = this.reservationForm.value;
      const reservation: Partial<Reservation> = {
        checkinDate: new Date(formValues.checkInDate),      // i am Converting input value to Date object
        checkoutDate: new Date(formValues.checkOutDate),    // i am Converting input value to Date object
        guestName: formValues.guestName,
        guestEmail: formValues.guestEmail,
        roomNumber: formValues.roomNumber
      };

      if(this.reservationId){
        //if updating than i am including the _id else i will not use _id 
        reservation._id = this.reservationId
        
        //updating existing reservation here
        this.reservationService.updateReservation(this.reservationId, reservation as Reservation).subscribe({next: ()=>{
          alert('Reservation updated successfully')
          this.router.navigate(['/list'])
        },
      error: (err)=>{
        console.error('Error updating reservation', err)
      }
    });
    }else{
      //adding a new reservation
      this.reservationService.addReservation(reservation as Reservation).subscribe({next: ()=>{
        alert("Reservation added Successfully")
        this.router.navigate(['/list']);
    } ,
    error: (err)=>{
      console.error('Error creating reservation', err);
      alert('failed to create reservation. Please try again');
    },
    })
  }
}
else{
  alert('please fill in the required fields.')
  }
 }
}
