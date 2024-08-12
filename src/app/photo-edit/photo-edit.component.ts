import { Component, inject, Input, input, OnInit, output } from '@angular/core';
import {Member} from "../models/Member"
import { CommonModule } from '@angular/common';
import { AccountsService } from '../_services/accounts.service';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../environments/environment.development';
import { MemberService } from '../_services/member.service';
import { Photo } from '../models/Photo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-edit',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './photo-edit.component.html',
  styleUrl: './photo-edit.component.css'
})
export class PhotoEditComponent implements OnInit {

member = input.required<Member>();
private accountService = inject(AccountsService)
uploader ?: FileUploader
baseUrl = environment.apiUrl
hasBaseDropZoneOver = false
memberChange = output<Member>()
memberService = inject(MemberService)
window?: Window
private router = inject(Router)

ngOnInit(): void {
  this.initializeUploader()
}

fileOverBase(e:any){
  this.hasBaseDropZoneOver = e
}



initializeUploader(){
  this.uploader = new FileUploader({
    url: this.baseUrl + "users/add-photo",
    authToken: "Bearer " + this.accountService.currentUser()?.token,
    isHTML5: true,
    allowedFileType: ['image'],
    removeAfterUpload: true,
    autoUpload: false,
    maxFileSize: 10 * 1024 * 1024
  })

  this.uploader.onAfterAddingFile = (file) => {
    file.withCredentials = false
  }

  this.uploader.onSuccessItem = (item, response, status, headers) => {
    console.log(response)
    const photo = JSON.parse(response)
    const updatedMember = {...this.member()}
    updatedMember.photos.push(photo)
    this.memberChange.emit(updatedMember)
    if(photo.isMain){
      const user = this.accountService.currentUser()
      if(user){
        user.photoUrl = photo.url
        this.accountService.setCurrentUser(user)
      }
      updatedMember.photoUrl = photo.url
      updatedMember.photos.forEach(p => {
        if(p.isMain) p.isMain = false
        if(p.id === photo.id) p.isMain = true
      })
    }
    // this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/member/edit']);
    // });
  }
}

updateMainPhoto(photo: Photo){
  console.log(photo.id)
  this.memberService.updateMemberMainPhoto(photo).subscribe({
    next: () => {
      const user = this.accountService.currentUser()
      if(user){
        user.photoUrl = photo.url
        this.accountService.setCurrentUser(user)
      }

      const updatedMember = {...this.member()}
      updatedMember.photoUrl = photo.url
      updatedMember.photos.forEach(p => {
        if(p.isMain) p.isMain = false
        if(p.id === photo.id) p.isMain = true
      })

      this.memberChange.emit(updatedMember)
    }
  })
}

deletePhoto(photo: Photo){
  console.log(photo)
  this.memberService.deleteMemberPhoto(photo).subscribe({
    next: () => {
      const updatedMember = {...this.member()}
      updatedMember.photos = updatedMember.photos.filter(p => p.id !== photo.id )
      this.memberChange.emit(updatedMember);
    }
  })
}

}
