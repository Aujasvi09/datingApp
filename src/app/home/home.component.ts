import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  registerMode = false
  http = inject(HttpClient);
  users:any

  ngOnInit(): void {
    this.getUsers()
  }

  toggleRegisterMode(){
    this.registerMode = !this.registerMode
  }
  getUsers(){
    this.http.get('http://localhost:5213/api/Users').subscribe({
      next: (res) =>  {this.users = res},
      error: (err) => {console.log(err)},
      complete: () => {console.log("API CALL DONE")}
  })
  }

  cancelRegister(event: boolean){
    console.log(event)
    this.registerMode = event
  }
}
