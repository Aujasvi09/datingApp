import { Component, inject, input, OnInit, output } from '@angular/core';
import { AccountsService } from '../_services/accounts.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { DatePickerComponent } from '../_forms/date-picker/date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, CommonModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
model: any = {}
usersFromHomeComponent = input.required<any>()
cancelRegister = output<boolean>()
accountService = inject(AccountsService)
registerForm: FormGroup = new FormGroup({})
maxDate = new Date
private router = inject(Router)


ngOnInit(): void {
  this.initializeForm()
  this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
}

initializeForm(){
  this.registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    confirmPassword: new FormControl('',[Validators.required,this.matchValues("password")]),
    knownAs: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    gender: new FormControl(['male'])
  })
  this.registerForm.controls["password"].valueChanges.subscribe({
    next: () => {
      this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    }
  })
}

matchValues(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value === control?.parent?.get(matchTo)?.value ? null : {isMatching: true}
  }
}

register(){
  const dob = this.getDateInString(this.registerForm.controls["dateOfBirth"].value)
  this.registerForm.patchValue({dateOfBirth:dob})
  this.accountService.register(this.registerForm.value).subscribe({
    next: res => {
      console.log(res)
      this.router.navigateByUrl("/members")
      this.cancel()
    },
    error: err => {
      console.log(err)
    }
})
}

getDateInString(date: Date): string{
  return date.toISOString().slice(0,10)
}

cancel(){
  this.cancelRegister.emit(false)
}
}
