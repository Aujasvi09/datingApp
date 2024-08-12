import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../_services/accounts.service';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{

  model:any = {};
  accountService = inject(AccountsService)
  private router = inject(Router)
  private toastr = inject(ToastrService)

  login() {
    this.accountService.login(this.model).subscribe({
      next : (res) => {
        this.router.navigateByUrl("/members")
      },

      error: (err) => {
        console.log(err)
        this.toastr.error(err.error)
      }
  })
  }

  ngOnInit(): void {
    
  }

  logOut(){
    this.accountService.logOut()
    this.router.navigateByUrl("/")
  }

}
