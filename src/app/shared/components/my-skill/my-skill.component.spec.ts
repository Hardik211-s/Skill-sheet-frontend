import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { MySkillComponent } from './my-skill.component';
import { AuthService } from '../../../service/auth.service';
import { UserskillService } from '../../../service/userskill.service';

describe('MySkillComponent', () => {
  let component: MySkillComponent;
  let fixture: ComponentFixture<MySkillComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userSkillService: jasmine.SpyObj<UserskillService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['loggedData']);
    const userSkillServiceMock = jasmine.createSpyObj('UserskillService', [
      'getUserSkillDataByID',
      'updateUserSkillData',
      'deleteUserSkillData',
    ]);

    authServiceMock.loggedData.and.returnValue({
      userData: { UserId: 1 },
    });

    userSkillServiceMock.getUserSkillDataByID.and.returnValue(of({ userSkill: [] }));
    userSkillServiceMock.updateUserSkillData.and.returnValue(of({}));
    userSkillServiceMock.deleteUserSkillData.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [],
      providers: [MySkillComponent,
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserskillService, useValue: userSkillServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MySkillComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userSkillService = TestBed.inject(UserskillService) as jasmine.SpyObj<UserskillService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user skills on initialization', () => {
    const mockResponse = {
      userSkill: [
        { userSkillId: 1, skill: 'JavaScript', proficiencyLevel: 'Advanced', category: 'Frontend', subcategory: 'Language', experience: 3, iconName: 'icon-js', username: 'user1' },
      ],
    };

    userSkillService.getUserSkillDataByID.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(userSkillService.getUserSkillDataByID).toHaveBeenCalledWith(1);
    expect(component.userSkill).toEqual(mockResponse.userSkill);
  });

  it('should handle error when fetching user skills', () => {
    userSkillService.getUserSkillDataByID.and.returnValue(throwError(() => new Error('Error fetching user skills')));

    component.ngOnInit();

    expect(userSkillService.getUserSkillDataByID).toHaveBeenCalledWith(1);
    expect(component.userSkill).toEqual([]);
  });

  it('should filter users based on search text', () => {
    component.userSkill = [
      { userSkillId: 1,
   proficiencyLevel: 'Expert',
         skill: 'JavaScript', category: 'Frontend', subcategory: 'Language',
        experience: 20,
        iconName: 'icon-js',
        username: 'user1'  }
     
    ];
    component.searchText = 'javascript';

    const filteredUsers = component.filteredUsers;

    expect(filteredUsers).toEqual([{
      userSkillId: 1,
      skill: 'JavaScript',
      proficiencyLevel: 'Expert',
      category: 'Frontend',
      subcategory: 'Language',
      experience: 20,
      iconName: 'icon-js',
      username: 'user1'
    }]);
  });

  it('should select a skill', () => {
    const skill = { userSkillId: 1, skill: 'JavaScript',  
      proficiencyLevel: '',
      subcategory: '',
      category: '',
      experience: 0,
      iconName: '',
      username: '' };

    component.selectSkill(skill);

    expect(component.selectedSkill).toEqual(skill);
  });

  it('should edit a skill successfully', () => {
    const mockResponse = { success: true };
    const closeModalMock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal = closeModalMock as any;

    userSkillService.updateUserSkillData.and.returnValue(of(mockResponse));

    component.editUserForm.setValue({
      proficiency: 'Intermediate',
      experience: '2',
    });
    component.selectedSkill = { userSkillId: 1 } as any;

    component.editSkill(closeModalMock as any);

    expect(userSkillService.updateUserSkillData).toHaveBeenCalledWith({
      proficiencyLevel: 'Intermediate',
      experience: '2',
      userId: 0,
      skillId: 0,
      userskillId: 1,
    });
    expect(closeModalMock.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle error when editing a skill', () => {
    const mockError = { error: { message: 'Error editing skill' } };
    const closeModalMock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal = closeModalMock as any;

    userSkillService.updateUserSkillData.and.returnValue(throwError(() => mockError));

    component.editUserForm.setValue({
      proficiency: 'Intermediate',
      experience: '2',
    });
    component.selectedSkill = { userSkillId: 1 } as any;

    component.editSkill(closeModalMock as any);

    expect(userSkillService.updateUserSkillData).toHaveBeenCalled();
    expect(closeModalMock.nativeElement.click).toHaveBeenCalled();
  });

  it('should delete a skill successfully', () => {
    const mockResponse = { success: true };
    const closeModalMock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal1 = closeModalMock as any;

    userSkillService.deleteUserSkillData.and.returnValue(of(mockResponse));

    component.selectedSkill = { userSkillId: 1 } as any;

    component.deleteSkill(closeModalMock as any);

    expect(userSkillService.deleteUserSkillData).toHaveBeenCalledWith(1);
    expect(closeModalMock.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle error when deleting a skill', () => {
    const mockError = { error: { message: 'Error deleting skill' } };
    const closeModalMock = { nativeElement: { click: jasmine.createSpy('click') } };
    component.closeModal1 = closeModalMock as any;

    userSkillService.deleteUserSkillData.and.returnValue(throwError(() => mockError));

    component.selectedSkill = { userSkillId: 1 } as any;

    component.deleteSkill(closeModalMock as any);

    expect(userSkillService.deleteUserSkillData).toHaveBeenCalledWith(1);
    expect(closeModalMock.nativeElement.click).toHaveBeenCalled();
  });
});