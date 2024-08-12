import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { Member } from '../../models/Member';
import { MemberDetailComponent } from "../member-detail/member-detail.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountsService } from '../../_services/accounts.service';
import { UserParams } from '../../models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';



@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberDetailComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  accountService = inject(AccountsService)
  memberService = inject(MemberService)
  // members: Member[] = []
  // userParams: UserParams = new UserParams(this.accountService.currentUser())
  genderList = [{value: "male", display: "Males"},{value: "female", display: "Females"}]

  ngOnInit(): void {
    if(!this.memberService.paginatedResult()){
      this.loadMembers()
   }
  }

  resetFilters(){
    this.memberService.resetUserParams()
    this.loadMembers()
  }

  loadMembers(){
    this.memberService.getMembers()
  }

  pageChanged(event: any){
    if(this.memberService.userParams().pageNumber !== event.page){
      this.memberService.userParams().pageNumber = event.page
      this.loadMembers()
    }
  }

}
