import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FindUserComponent } from './find-user.component';
import { SkilldataService } from '../../../service/skilldata.service';
import { DashboardService } from '../../../service/dashboard.service';
import { CategoryResponse, SkillResponse, SubCategoryResponse } from '../../../interface/skill';
import { DashboardResponse } from '../../../interface/dashboard';

describe('FindUserComponent', () => {
  let component: FindUserComponent;
  let fixture: ComponentFixture<FindUserComponent>;
  let skillDataService: jasmine.SpyObj<SkilldataService>;
  let dashboardService: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    const skillDataServiceMock = jasmine.createSpyObj('SkilldataService', [
      'getCategoryData',
      'getSubCategoryDataByID',
      'getSkillDataByID',
    ]);
    const dashboardServiceMock = jasmine.createSpyObj('DashboardService', ['getDashboardData']);

    // Mock the return values for the services
    skillDataServiceMock.getCategoryData.and.returnValue(of({ category: [] }));
    skillDataServiceMock.getSubCategoryDataByID.and.returnValue(of({ subCategory: [] }));
    skillDataServiceMock.getSkillDataByID.and.returnValue(of({ skills: [] }));
    dashboardServiceMock.getDashboardData.and.returnValue(of({
      message: 'success',
      data: {
        allUserDetail: [],
        userAllData: [],
        experienceAVG: 0,
        totalSkill: 0,
        totalUser: 0,
      },
    }));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [],
      providers: [FindUserComponent,
        { provide: SkilldataService, useValue: skillDataServiceMock },
        { provide: DashboardService, useValue: dashboardServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FindUserComponent);
    component = fixture.componentInstance;
    skillDataService = TestBed.inject(SkilldataService) as jasmine.SpyObj<SkilldataService>;
    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch skill categories on initialization', () => {
    const mockResponse: CategoryResponse = {
      category: [{ skillCategoryId: 1, skillCategoryName: 'Category 1', iconName: 'icon 1' }],
    };
    skillDataService.getCategoryData.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(skillDataService.getCategoryData).toHaveBeenCalled();
    expect(component.skillCategory).toEqual(mockResponse.category);
  });

  it('should handle error when fetching skill categories', () => {
    skillDataService.getCategoryData.and.returnValue(throwError(() => new Error('Error fetching categories')));

    component.ngOnInit();

    expect(skillDataService.getCategoryData).toHaveBeenCalled();
    expect(component.skillCategory).toEqual([]);
  });

  it('should fetch dashboard data on initialization', () => {
    const mockResponse: DashboardResponse = {
      message: 'success',
      data: {
        allUserDetail: [],
        userAllData: [],
        experienceAVG: 0,
        totalSkill: 0,
        totalUser: 0,
      },
    };
    dashboardService.getDashboardData.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(dashboardService.getDashboardData).toHaveBeenCalled();
    expect(component.allData).toEqual(mockResponse.data);
  });

  it('should handle error when fetching dashboard data', () => {
    dashboardService.getDashboardData.and.returnValue(throwError(() => new Error('Error fetching dashboard data')));

    component.ngOnInit();

    expect(dashboardService.getDashboardData).toHaveBeenCalled();
    expect(component.allData).toEqual({
      allUserDetail: [],
      userAllData: [],
      experienceAVG: 0,
      totalSkill: 0,
      totalUser: 0,
    });
  });

  it('should fetch subcategories when OnCategory is called', () => {
    const mockResponse: SubCategoryResponse = {
      subCategory: [{ skillSubcategoryId: 1, skillSubcategoryName: 'Subcategory 1', iconName: 'icon1' }],
    };
    component.skillForm.get('category')?.setValue('1');
    skillDataService.getSubCategoryDataByID.and.returnValue(of(mockResponse));

    component.OnCategory();

    expect(skillDataService.getSubCategoryDataByID).toHaveBeenCalledWith('1');
    expect(component.skillSubCategory).toEqual(mockResponse.subCategory);
  });

  it('should handle error when fetching subcategories', () => {
    component.skillForm.get('category')?.setValue('1');
    skillDataService.getSubCategoryDataByID.and.returnValue(throwError(() => new Error('Error fetching subcategories')));

    component.OnCategory();

    expect(skillDataService.getSubCategoryDataByID).toHaveBeenCalledWith('1');
    expect(component.skillSubCategory).toEqual([]);
  });

  it('should fetch skills when OnSubcategory is called', () => {
    const mockResponse: SkillResponse = {
      skills: [{ skillId: 1, iconName: 'icon 1', skillName: 'Skill 1' }],
    };

    component.skillForm.get('subCategory')?.setValue('1');
    skillDataService.getSkillDataByID.and.returnValue(of(mockResponse));

    component.OnSubcategory();

    expect(skillDataService.getSkillDataByID).toHaveBeenCalledWith('1');
    expect(component.skills).toEqual(mockResponse.skills);
  });

  it('should handle error when fetching skills', () => {
    component.skillForm.get('subCategory')?.setValue('1');
    skillDataService.getSkillDataByID.and.returnValue(throwError(() => new Error('Error fetching skills')));

    component.OnSubcategory();

    expect(skillDataService.getSkillDataByID).toHaveBeenCalledWith('1');
    expect(component.skills).toEqual([]);
  });

  it('should set searchText when OnSkill is called', () => {
    component.OnSkill('JavaScript');
    expect(component.searchText).toBe('JavaScript');
  });

  it('should set userId and trigger change detection when setUserId is called', () => {
    spyOn(component['cdr'], 'detectChanges');
    component.setUserId(123);

    expect(component.userId).toBe(123);
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it('should filter users when searchUsers is called', () => {
    component.allData = {
      allUserDetail: [
        {
          userId: 1,
          username: 'user1',
          qualification: 'Bachelor',
          workJapan: true,
          photo: 'photo1.jpg',
          birthdate: '1990-01-01',
          fullName: 'User One',
          joiningDate: '2020-01-01',
          country: 'Japan',
          sex: 'male',
          phoneNo: 3929329399,
          description: 'I am a hard worker',
          age: 10,
          email: 'user1@example.com',
          lastname: 'Doe',
        },
      ],
      userAllData: [
        {
          skill: 'JavaScript',
          username: 'user1',
          category: 'Frontend',
          experience: 3,
          iconName: 'icon-js',
          proficiencyLevel: 'Advanced',
          subcategory: 'Language',
          userSkillId: 2,
        },
      ],
      experienceAVG: 0,
      totalSkill: 0,
      totalUser: 0,
    };
    component.searchText = 'JavaScript';

    component.searchUsers();

    expect(component.filteredUser).toEqual([
      {
        userId: 1,
        username: 'user1',
        qualification: 'Bachelor',
        workJapan: true,
        photo: 'photo1.jpg',
        birthdate: '1990-01-01',
        fullName: 'User One',
        joiningDate: '2020-01-01',
        country: 'Japan',
        sex: 'male',
        phoneNo: 3929329399,
        description: 'I am a hard worker',
        age: 10,
        email: 'user1@example.com',
        lastname: 'Doe',
      },
    ]);
  });
});