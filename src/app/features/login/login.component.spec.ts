import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

// Mock NavbarComponent
@Component({
  selector: 'app-navbar',
  template: '',
})
class MockNavbarComponent {
  isLoggedIn = false;

  ngOnInit() {
    // Mock the behavior of NavbarComponent's ngOnInit
    this.isLoggedIn = true;
  }
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // const authServiceMock = jasmine.createSpyObj('AuthService', ['getAllUser', 'login', 'setLoginData']);
    const authServiceMock = jasmine.createSpyObj(
      'AuthService',
      ['getAllUser', 'login', 'setLoginData', 'logout'],
      {
        loggedIn$: of(true), // Mock the loggedIn$ observable
      }
    );
    // Mock the `getAllUser` method to return an observable
    authServiceMock.getAllUser.and.returnValue(
      of({
        message: 'dome',
        allUsers: [
          {
            username: 'testuser',
            email: 'test@example.com',
            role: 'User',
            userid: 1,
          },
        ],
      })
    );

    // Mock the `login` method to return an observable
    authServiceMock.login.and.returnValue(
      of({
        token: 'token',
        userData: {
          username: 'testuser',
          email: 'test@example.com',
          role: 'User',
          userid: 1,
        },
      })
    );

    // Mock the `setLoginData` method to return an observable
    authServiceMock.setLoginData.and.returnValue(of(true));

    // Mock the `setLoginData` method

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [
        LoginComponent,
        MockNavbarComponent,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch all users on ngOnInit', () => {
    component.ngOnInit();

    expect(authService.getAllUser).toHaveBeenCalled();
    expect(component.alluser).toEqual([
      {
        username: 'testuser',
        email: 'test@example.com',
        role: 'User',
        userid: 1,
      },
    ]);
  });

  it('should handle error when submitting the form', () => {
    spyOn(component['_snackBar'], 'open');
    authService.login.and.returnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );

    component.loginForm.setValue({
      role: 'User',
      username: 'testuser',
      password: 'wrongpassword',
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(component['_snackBar'].open).toHaveBeenCalledWith(
      'Invalid credentials',
      'Remove',
      {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      }
    );
  });

  it('should check if a field is touched in isFieldTouched', () => {
    component.loginForm.get('username')?.markAsTouched();

    const isTouched = component.isFieldTouched('username');

    expect(isTouched).toBeTrue();
  });
});
