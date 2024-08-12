import { Component, inject, OnInit } from '@angular/core';
import { LikeService } from '../_services/like.service';
import { Member } from '../models/Member';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MemberDetailComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit{

  private likeService = inject(LikeService)
  members: Member[] = []
  predicate:string = "liked"

  ngOnInit(): void {
    this.loadLikedMembers()
  }

  togglePredicate(event: Event){
    const target = event.target as HTMLElement
    const buttonText = target.innerText
    switch (buttonText) {
      case "Mutual":
        this.predicate = "mutual"
        this.loadLikedMembers()
        break;
      case "Members who like me":
        this.predicate = "likedBy"
        this.loadLikedMembers()
        break
      default:
        this.predicate = "liked"
        this.loadLikedMembers()
        break;
    }
  }

  loadLikedMembers(){
    this.likeService.getLikes(this.predicate).subscribe({
      next: (members) => {
        this.members = members
      }
    })
  }

}
