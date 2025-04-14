import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserComponent } from './manage-user.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';
import { of, throwError } from 'rxjs';

describe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        ReactiveFormsModule,ManageUserComponent,HttpClientModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUserComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize editUserForm with default values', () => {
    expect(component.editUserForm.get('username')?.value).toBe('');
    expect(component.editUserForm.get('email')?.value).toBe('');
    expect(component.editUserForm.get('password')?.value).toBe('');
  });

  it('should filter users based on searchText', () => {
    component.allUsers = [
      { userid: 1, username: 'John', email: 'john@example.com', role: 'User' },
      { userid: 2, username: 'Admin', email: 'admin@example.com', role: 'Admin' }
    ];
    component.searchText = 'john';
    const filteredUsers = component.filteredUsers;
    expect(filteredUsers.length).toBe(1);
    expect(filteredUsers[0].username).toBe('John');
  });

  it('should sort users by username', () => {
    component.allUsers = [
      { userid: 1, username: 'Zack', email: 'zack@example.com', role: 'User' },
      { userid: 2, username: 'Anna', email: 'anna@example.com', role: 'User' }
    ];
    component.sortOnUsername();
    expect(component.allUsers[0].username).toBe('Anna');
    expect(component.allUsers[1].username).toBe('Zack');
  });

  
  it('should delete a user successfully', () => {
    const closeModal2Mock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal2 = closeModal2Mock as any;
    component.selectedUser = { userid: 1, username: 'testuser', email: '', role: '' };

    spyOn(authService, 'deleteUser').and.returnValue(of({}));
    spyOn(component, 'ngOnInit');
    spyOn(component['_snackBar'], 'open');

    component.deleteUser(closeModal2Mock.nativeElement as any);

    expect(authService.deleteUser).toHaveBeenCalledWith('testuser');
    expect(component.load).toBeFalse();
    expect(component['_snackBar'].open).toHaveBeenCalledWith('User Deleted !', 'Remove', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(closeModal2Mock.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle error when deleting a user', () => {
    const closeModal2Mock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal2 = closeModal2Mock as any;
    component.selectedUser = { userid: 1, username: 'testuser', email: '', role: '' };

    spyOn(authService, 'deleteUser').and.returnValue(throwError(() => ({ error: 'Error deleting user' })));
    spyOn(component['_snackBar'], 'open');

    component.deleteUser(closeModal2Mock.nativeElement as any);

    expect(authService.deleteUser).toHaveBeenCalledWith('testuser');
    expect(component.load).toBeFalse();
    expect(component['_snackBar'].open).toHaveBeenCalledWith('Error deleting user', 'Remove', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
    expect(closeModal2Mock.nativeElement.click).not.toHaveBeenCalled();
  });

  it('should toggle the show property when enableBtn is called', () => {
    const initialShowValue = component.show;
    component.enableBtn();
    expect(component.show).toBe(!initialShowValue);
  });

 

  it('should edit a user successfully', () => {
    const closeModalMock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal = closeModalMock as any;

    // Mock form values
    component.editUserForm.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password@123'
    });

    spyOn(authService, 'updateUser').and.returnValue(of({}));
    spyOn(component, 'ngOnInit');
    spyOn(component['_snackBar'], 'open');

    component.editUser(closeModalMock.nativeElement as any);

    expect(authService.updateUser).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password@123',
      role: 'User'
    });
    expect(component.load).toBeFalse();
    expect(component['_snackBar'].open).toHaveBeenCalledWith('User Edited !', 'Remove', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(closeModalMock.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle error when editing a user', () => {
    const closeModalMock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal = closeModalMock as any;

    // Mock form values
    component.editUserForm.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password@123'
    });

    spyOn(authService, 'updateUser').and.returnValue(throwError(() => ({ error: 'Error editing user' })));
    spyOn(component['_snackBar'], 'open');

    component.editUser(closeModalMock.nativeElement as any);

    expect(authService.updateUser).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password@123',
      role: 'User'
    });
    expect(component.load).toBeTrue();
    expect(component['_snackBar'].open).toHaveBeenCalledWith('Error : User not Edited !', 'Remove', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
    expect(closeModalMock.nativeElement.click).not.toHaveBeenCalled();
  });
});

