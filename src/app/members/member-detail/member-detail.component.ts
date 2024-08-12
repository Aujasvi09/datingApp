import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../models/Member';
import { RouterLink } from '@angular/router';
import { LikeService } from '../../_services/like.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent {
private likeService = inject(LikeService)
member = input.required<Member>();
hasLiked = computed(() => {return this.likeService.likeIds().includes(this.member().id)})

toggleLike(){
  this.likeService.toggleLike(this.member().id).subscribe({
    next: () => {
      if(this.hasLiked()){
        this.likeService.likeIds.update(ids => ids.filter(i => i !== this.member().id))

      }else{
        this.likeService.likeIds.update(ids => [...ids, this.member().id])
      }
    }
  })
}
}
