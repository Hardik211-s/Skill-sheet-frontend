import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AddUserAdminComponent } from './add-user-admin.component';
import { AuthService } from '../../../service/auth.service';
import { RegisterUserResponse } from '../../../interface/auth';
import { HttpClientModule } from '@angular/common/http';

describe('AddUserAdminComponent', () => {
  let component: AddUserAdminComponent;
  let fixture: ComponentFixture<AddUserAdminComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        HttpClientModule,AddUserAdminComponent
      ],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserAdminComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.addUserForm).toBeDefined();
    expect(component.addUserForm.get('role')?.value).toBe('');
    expect(component.addUserForm.get('username')?.value).toBe('');
    expect(component.addUserForm.get('email')?.value).toBe('');
    expect(component.addUserForm.get('password')?.value).toBe('');
  });

  it('should mark a field as touched when isFieldTouched is called', () => {
    const fieldName = 'username';
    component.addUserForm.get(fieldName)?.markAsTouched();
    expect(component.isFieldTouched(fieldName)).toBeTrue();
  });

  it('should submit the form and add a user successfully', () => {
    const mockResponse: RegisterUserResponse = {
      message: 'User added successfully',
      user: {
        userid: 1,
        role: 'Admin',
        email: 'test@example.com',
        username: 'testuser',
      },
    };

    spyOn(authService, 'registerUser').and.returnValue(of(mockResponse));
    spyOn(component['_snackBar'], 'open');

    component.addUserForm.setValue({
      role: 'Admin',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password@123',
    });

    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalledWith({
      role: 'Admin',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password@123',
    });
    expect(component.load).toBeFalse();
    expect(component.addUserForm.get('role')?.value).toBe('User');
    expect(component['_snackBar'].open).toHaveBeenCalledWith(
      'User add successfully !',
      'Remove',
      {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      }
    );
    expect(component.addedUser).toEqual(mockResponse.user);
  });

  it('should handle error when submitting the form', () => {
    const mockError = { error: 'Error adding user' };

    spyOn(authService, 'registerUser').and.returnValue(throwError(() => mockError));
    spyOn(component['_snackBar'], 'open');

    component.addUserForm.setValue({
      role: 'Admin',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password@123',
    });

    component.onSubmit();

    expect(authService.registerUser).toHaveBeenCalledWith({
      role: 'Admin',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password@123',
    });
    expect(component.load).toBeFalse();
    expect(component['_snackBar'].open).toHaveBeenCalledWith(
      'Error adding user',
      'Remove',
      {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      }
    );
  });
});