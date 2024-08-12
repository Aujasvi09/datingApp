import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Member } from '../models/Member';
import { AccountsService } from '../_services/accounts.service';
import { MemberService } from '../_services/member.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditComponent } from "../photo-edit/photo-edit.component";
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditComponent, TimeagoModule, DatePipe],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm !: NgForm
  @HostListener('window:beforeunload',['$event']) notify($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true
    }
  }
  
  member!: Member;
  accountServie = inject(AccountsService)
  memberService = inject(MemberService)
  toastr = inject(ToastrService)


  ngOnInit(): void {
      this.loadMember()
  }

  loadMember(){
    const user = this.accountServie.currentUser()
    console.log("USER",user)
    if(!user) {
      console.log("NO API CALL")
      return
    } 
    console.log("API CALLED")
    this.memberService.getMember(user.username).subscribe({
      next: (member) => {
        console.log(member)
        this.member = member
      }
    })
  }

  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => {
      this.toastr.success("Profile updated sucessfully")
      this.editForm.reset(this.member)
      }
    })
  }

  onMemberChange(e: Member){
    console.log("MEMBER UPDATED",e)
    this.member = e
  }


}
