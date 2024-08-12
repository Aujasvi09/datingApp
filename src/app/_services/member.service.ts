import { HttpClient, HttpHeaders, HttpParams, HttpResponseBase } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member } from '../models/Member';
import { AccountsService } from './accounts.service';
import { of, tap } from 'rxjs';
import { Photo } from '../models/Photo';
import { PaginatedResult } from '../models/Pagination';
import { UserParams } from '../models/userParams';
import { HttpResponse } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

http = inject(HttpClient);
baseUrl = environment.apiUrl
accountService = inject(AccountsService)
paginatedResult = signal<PaginatedResult<Member[]> | null>(null)
memberCache = new Map();
user = this.accountService.currentUser()
userParams = signal<UserParams>(new UserParams(this.user))

resetUserParams(){
  this.userParams.set(new UserParams(this.user))
}


getMembers(){
  const response = this.memberCache.get(Object.values(this.userParams()).join("-"))
  if(response) 
    {
      return this.setPaginationResponse(response)
    }
  let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize)

  params = params.append("minAge",this.userParams().minAge)
  params = params.append("maxAge",this.userParams().maxAge)
  params = params.append("gender",this.userParams().gender)
  params = params.append("orderBy",this.userParams().orderBy)

  return this.http.get<Member[]>(this.baseUrl + "users", {observe:'response',params}).subscribe(
    {
      next: (response) => {
        this.setPaginationResponse(response)
        this.memberCache.set(Object.values(this.userParams()).join("-"),response)
      }
    }
  )
}


private setPaginationResponse(response: any) {
  this.paginatedResult.set({
    items: response.body as Member[],
    pagination: JSON.parse(response.headers.get("Pagination") || '{}')
  });
}

private setPaginationHeaders(pageNumber: number, pageSize: number){
  let params = new HttpParams()
  if(pageNumber && pageSize){
    params = params.append('pageNumber', pageNumber)
    params = params.append('pageSize',pageSize)
  }
  return params
}

getMember(username: string){
  const membersArray = [...this.memberCache.values()][0]?.body
  
  if(membersArray.length > 0){
    const member = membersArray.find((m: { userName: string; }) => m.userName === username)    
  if(member){
    return of(member)
  }
  }
  return this.http.get<Member>(this.baseUrl + 'users/' + username,this.getHttpOptions())
}


updateMember(member: Member){
  return this.http.put(this.baseUrl + 'users', member, this.getHttpOptions())
}

updateMemberMainPhoto(photo: Photo){
  return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {}, this.getHttpOptions()).pipe(
    // tap(() => {
    //   this.members.update(members => members.map(m => {
    //     if(m.photos.includes(photo)){
    //       m.photoUrl =  photo.url
    //     }
    //     return m
    //   }))
    // })
  )
}

deleteMemberPhoto(photo: Photo){
  return this.http.delete(this.baseUrl + "users/delete-photo/" + photo.id, this.getHttpOptions()).pipe(
    // tap(() => {
    //   this.members.update(members => members.map(m => {
    //     if(m.photos.includes(photo)){
    //       m.photos.filter(p => p.id !== photo.id)
    //     }
    //     return m
    //   }))
    // })
  )
}

getHttpOptions(){

  return{
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.accountService.currentUser()?.token}`
    }),
    
  }

}
}
