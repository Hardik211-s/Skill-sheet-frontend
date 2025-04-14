import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddSkillComponent } from './add-skill.component';
import { SkilldataService } from '../../../service/skilldata.service';
import { AuthService } from '../../../service/auth.service';
import { CategoryResponse, SubCategoryResponse, SkillResponse } from '../../../interface/skill';

describe('AddSkillComponent', () => {
  let component: AddSkillComponent;
  let fixture: ComponentFixture<AddSkillComponent>;
  let skillDataService: SkilldataService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      providers: [SkilldataService,AddSkillComponent, AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSkillComponent);
    component = fixture.componentInstance;
    skillDataService = TestBed.inject(SkilldataService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch skill categories on initialization', () => {
    const mockResponse: CategoryResponse = {
      category: [{ skillCategoryId: 1,
        skillCategoryName: 'Category 1',
        iconName: 'icon 1' }],
    };

    spyOn(skillDataService, 'getCategoryData').and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(skillDataService.getCategoryData).toHaveBeenCalled();
    expect(component.skillCategory).toEqual(mockResponse.category);
  });

  it('should handle error when fetching skill categories', () => {
    spyOn(skillDataService, 'getCategoryData').and.returnValue(throwError(() => new Error('Error fetching categories')));

    component.ngOnInit();

    expect(skillDataService.getCategoryData).toHaveBeenCalled();
    expect(component.skillCategory).toEqual([]);
  });

  it('should fetch subcategories when OnCategory is called', () => {
    const mockResponse: SubCategoryResponse = {
      subCategory: [{ skillSubcategoryId: 1, skillSubcategoryName: 'Subcategory 1' ,iconName: 'icon1'}],
    };

    component.firstFormGroup.get('firstCtrl')?.setValue('1');
    spyOn(skillDataService, 'getSubCategoryDataByID').and.returnValue(of(mockResponse));

    component.OnCategory();

    expect(skillDataService.getSubCategoryDataByID).toHaveBeenCalledWith('1');
    expect(component.skillSubCategory).toEqual(mockResponse.subCategory);
  });

  it('should handle error when fetching subcategories', () => {
    component.firstFormGroup.get('firstCtrl')?.setValue('1');
    spyOn(skillDataService, 'getSubCategoryDataByID').and.returnValue(throwError(() => new Error('Error fetching subcategories')));

    component.OnCategory();

    expect(skillDataService.getSubCategoryDataByID).toHaveBeenCalledWith('1');
    expect(component.skillSubCategory).toEqual([]);
  });

  it('should fetch skills when OnSubcategory is called', () => {
    const mockResponse: SkillResponse = {
      skills: [{   skillId: 1,
        iconName: 'icon 1',
        skillName: 'Skill 1' }],
    };

    component.secondFormGroup.get('secondCtrl')?.setValue('1');
    spyOn(skillDataService, 'getSkillDataByID').and.returnValue(of(mockResponse));

    component.OnSubcategory();

    expect(skillDataService.getSkillDataByID).toHaveBeenCalledWith('1');
    expect(component.skills).toEqual(mockResponse.skills);
  });

  it('should handle error when fetching skills', () => {
    component.secondFormGroup.get('secondCtrl')?.setValue('1');
    spyOn(skillDataService, 'getSkillDataByID').and.returnValue(throwError(() => new Error('Error fetching skills')));

    component.OnSubcategory();

    expect(skillDataService.getSkillDataByID).toHaveBeenCalledWith('1');
    expect(component.skills).toEqual([]);
  });

  

  it('should reset the stepper when resetStepper is called', () => {
    const fileInputMock = { click: jasmine.createSpy('click') };

    component.resetStepper(fileInputMock as any);

    expect(fileInputMock.click).toHaveBeenCalled();
  });

  it('should format the label correctly in formatLabel', () => {
    expect(component.formatLabel(500)).toBe('500');
    expect(component.formatLabel(1500)).toBe('2k');
  });
});