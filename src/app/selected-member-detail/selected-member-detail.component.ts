import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../models/Member';
import { TabsModule } from "ngx-bootstrap/tabs"
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-selected-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe],
  templateUrl: './selected-member-detail.component.html',
  styleUrl: './selected-member-detail.component.css'
})
export class SelectedMemberDetailComponent implements OnInit {

memberService = inject(MemberService)
private route = inject(ActivatedRoute)
member?: Member
images: GalleryItem[] = []

ngOnInit(): void {
  this.loadMember()
}

loadMember(){
  const username = this.route.snapshot.paramMap.get("username")
  console.log(username)
  if (username === null) return
  this.memberService.getMember(username).subscribe({
    next: member => {
      this.member = member
      this.member?.photos.map(p => {
        this.images.push(new ImageItem({
          src: p.url,
          thumb: p.url
        }))
      })
    } 
  })
}


}
