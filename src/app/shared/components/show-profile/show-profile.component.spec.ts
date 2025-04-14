import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ShowProfileComponent } from './show-profile.component';
import { UserskillService } from '../../../service/userskill.service';
import { UserdetailService } from '../../../service/userdetail.service';
import { AuthService } from '../../../service/auth.service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';

describe('ShowProfileComponent', () => {
  let component: ShowProfileComponent;
  let fixture: ComponentFixture<ShowProfileComponent>;
  let userSkillService: jasmine.SpyObj<UserskillService>;
  let userDetailService: jasmine.SpyObj<UserdetailService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userSkillServiceMock = jasmine.createSpyObj('UserskillService', ['getUserSkillDataByID']);
    const userDetailServiceMock = jasmine.createSpyObj('UserdetailService', ['userDetailById', 'addData']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['loggedData', 'changeUserPassword']);

    // Mock return values for services
    userSkillServiceMock.getUserSkillDataByID.and.returnValue(of({ userSkill: [] }));
    userDetailServiceMock.userDetailById.and.returnValue(of({ userDetail: {} }));
    authServiceMock.loggedData.and.returnValue({
      userData: { UserId: 1, Name: 'Test User', Email: 'test@example.com', Role: 'Admin' },
    });
    authServiceMock.changeUserPassword.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [ShowProfileComponent,
        { provide: UserskillService, useValue: userSkillServiceMock },
        { provide: UserdetailService, useValue: userDetailServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowProfileComponent);
    component = fixture.componentInstance;
    userSkillService = TestBed.inject(UserskillService) as jasmine.SpyObj<UserskillService>;
    userDetailService = TestBed.inject(UserdetailService) as jasmine.SpyObj<UserdetailService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user details and skills on ngOnInit', () => {
    component.ngOnInit();

    expect(authService.loggedData).toHaveBeenCalled();
    expect(userDetailService.userDetailById).toHaveBeenCalledWith(1);
    expect(userSkillService.getUserSkillDataByID).toHaveBeenCalledWith(1);
  });

 

  it('should handle error when fetching user skills', () => {
    userSkillService.getUserSkillDataByID.and.returnValue(throwError(() => new Error('Error fetching user skills')));

    component.loadData();

    expect(userSkillService.getUserSkillDataByID).toHaveBeenCalled(); 
  });

  it('should change password successfully', () => {
    const closeModalMock = { click: jasmine.createSpy('click') } as any;
    component.closeModal = { nativeElement: closeModalMock } as ElementRef;

    component.editUserForm.setValue({
      password: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    component.changePassword(closeModalMock);

   
    expect(closeModalMock.click).toHaveBeenCalled();
  });

  it('should handle error when changing password', () => {
    const closeModalMock = { click: jasmine.createSpy('click') } as any;
    component.closeModal = { nativeElement: closeModalMock } as ElementRef;

    authService.changeUserPassword.and.returnValue(throwError(() => new Error('Error changing password')));

    component.editUserForm.setValue({
      password: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    });

    component.changePassword(closeModalMock);

    expect(authService.changeUserPassword).toHaveBeenCalled();
    expect(closeModalMock.click).not.toHaveBeenCalled();
  });

  it('should filter user skills by category', () => {
    component.userSkill = [
      {userSkillId:1, proficiencyLevel:'expert', experience:3, iconName:'icon 3', username : 'hardik' ,skill:'java', subcategory:'programming', category:'language'},
    ];

    const filteredSkills = component.filterCategory('java');

    expect(filteredSkills).toEqual([{userSkillId:1, proficiencyLevel:'expert', experience:3, iconName:'icon 3', username : 'hardik' ,skill:'java', subcategory:'programming', category:'language'}]);
  });

  it('should filter user skills by excluding a category', () => {
    component.userSkill = [
      {userSkillId:1, proficiencyLevel:'expert', experience:3, iconName:'icon 3', username : 'hardik' ,skill:'java', subcategory:'programming', category:'language'}
    ];

    const filteredSkills = component.filterByExcludeSkill();

    expect(filteredSkills).toEqual([{userSkillId:1, proficiencyLevel:'expert', experience:3, iconName:'icon 3', username : 'hardik' ,skill:'java', subcategory:'programming', category:'language'}]);
  });
});