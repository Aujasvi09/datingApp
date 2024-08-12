import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/User';
import { map } from 'rxjs';
import { LikeService } from './like.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private likeService = inject(LikeService)
  private http = inject(HttpClient)
  baseUrl = "http://localhost:5213/api/"
  currentUser = signal<User | null>(null)

  login(model: any){
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map(user => {
        if(user){
          localStorage.setItem('user',JSON.stringify(user))
          this.currentUser.set(user)
        }
        return user;
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user)
        }
        return user
      })
    )
  }

setCurrentUser(user: User){
  localStorage.setItem('user',JSON.stringify(user))
  this.currentUser.set(user)
  this.likeService.getLikeIds()
}

  logOut(){
    localStorage.removeItem("user")
    this.currentUser.set(null)
  }
}
