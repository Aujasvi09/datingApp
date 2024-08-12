import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  http = inject(HttpClient);
  baseUrl = environment.apiUrl
  likeIds = signal<number[]>([])


  toggleLike(targetId : number){
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {})
  }

  getLikes(predicate: string){
    return this.http.get<Member[]>(`${this.baseUrl}likes/list?predicate=${predicate}`)
  }

  getLikeIds(){
    return this.http.get<number[]>(`${this.baseUrl}likes`).subscribe({
      next: (ids) => {
        console.log(ids)
        this.likeIds.set(ids)
      }
    })
  }

}
