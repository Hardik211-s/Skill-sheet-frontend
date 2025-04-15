import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';  // Import Bootstrap's Toast API
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RegisterUserResponse, User } from '../../interface/auth';
import { AuthService } from '../../service/auth.service';

export interface UserData {
  role: string | null | undefined;
  email: string | null | undefined;
  username: string | null | undefined;
  password: string | null | undefined;
}
export interface AddedUser {
  id: number;
  role: string;
  email: string;
  username: string; // ISO date string
}
export interface ApiError {
  error: string; // Error message
  status: number; // HTTP status code
  message?: string; // Optional additional message
}
@Component({
  selector: 'app-add-user-admin',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoaderComponent],
  templateUrl: './add-user-admin.component.html',
  styleUrl: './add-user-admin.component.scss'
})
export class AddUserAdminComponent {

  load: boolean = false
  addedUser: User = {
    userid: 0,
    role: '',
    email: '',
    username: '',
  };
  userData: UserData = {
    role: '',
    email: '',
    username: '',
    password: ''
  }

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private authService: AuthService) {
  }

  addUserForm = new FormGroup({
    role: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    )])
  });

  isFieldTouched(field: string): boolean | undefined {
    return this.addUserForm.get(field)?.dirty || this.addUserForm.get(field)?.touched;
  }

  onSubmit() {
    this.load = true;
    this.userData = {
      role: this.addUserForm.get('role')?.value,
      email: this.addUserForm.get('email')?.value,
      username: this.addUserForm.get('username')?.value,
      password: this.addUserForm.get('password')?.value,
    }
    this.authService.registerUser(this.userData).pipe(
      catchError((error) => {
        this.load = false
        this._snackBar.open(error.error, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return throwError(() => error);
      })
    ).subscribe((res: RegisterUserResponse) => {
      this.load = false
      this.addUserForm.reset();
      this.addUserForm.get('role')?.setValue('User')
      this._snackBar.open("User add successfully !", 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });
      this.addedUser = res.user;
    })
  }
}
