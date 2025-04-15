import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PersonalDetailComponent } from './personal-detail.component';
import { UserdetailService } from '../../service/userdetail.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

describe('PersonalDetailComponent - Constructor Mocking', () => {
  let component: PersonalDetailComponent;
  let fixture: ComponentFixture<PersonalDetailComponent>;
  let userDetailService: jasmine.SpyObj<UserdetailService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const userDetailServiceMock = jasmine.createSpyObj('UserdetailService', [
      'editUserDetail',
      'getIsEdit',
      'addData',
      'isUserPresent',
      'userDetailById',
    ]);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['loggedData']);

    // Mock the `editUser$` observable
    userDetailServiceMock.editUser$ = of(true);
    userDetailServiceMock.userDetailById.and.returnValue(of({ userDetail: { username: 'testuser' , userId: 0,
      qualification: 'user',
      workJapan: false,
      photo: 'swoioq',
      birthdate: '21221',
      fullName: '2sw',
      joiningDate: 'w12w',
      country: 'india',
      sex: 'male',
      phoneNo: 0,
      description: 'cs',
      lastname: 'hardik' } }));

    // Mock the `loggedData` method
    authServiceMock.loggedData.and.returnValue({
      userData: { UserId: 1, Name: 'Test User', Email: 'test@example.com', Role: 'Admin' },
    });

    // Mock the `getIsEdit` method
    userDetailServiceMock.getIsEdit.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [],
      providers: [PersonalDetailComponent,
        { provide: UserdetailService, useValue: userDetailServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailComponent);
    component = fixture.componentInstance;
    userDetailService = TestBed.inject(UserdetailService) as jasmine.SpyObj<UserdetailService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call userDetailById and initialize profileData on ngOnInit', () => {
    component.ngOnInit();

    expect(userDetailService.userDetailById).toHaveBeenCalledWith(1);
    expect(component.profileData).toEqual({ username: 'testuser' , userId: 0,
      qualification: 'user',
      workJapan: false,
      photo: 'swoioq',
      birthdate: '21221',
      fullName: '2sw',
      joiningDate: 'w12w',
      country: 'india',
      sex: 'male',
      phoneNo: 0,
      description: 'cs',
      lastname: 'hardik'});
  });

  it('should initialize constructor values correctly', () => {
    // Verify that `userDetailById` is called
    expect(userDetailService.userDetailById).toHaveBeenCalled();

    // Verify that `loggedData` is called
    expect(authService.loggedData).toHaveBeenCalled();

    // Verify that `user` is initialized correctly
    expect(component.user).toEqual({
      UserId: 1,
      Name: 'Test User',
      Email: 'test@example.com',
      Role: 'Admin',
    });

  });
});