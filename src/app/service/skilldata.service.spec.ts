import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SkilldataService } from './skilldata.service';
import { environment } from '../../environments/envoronment';

describe('SkilldataService', () => {
  let service: SkilldataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkilldataService],
    });
    service = TestBed.inject(SkilldataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch category data', () => {
    const mockResponse = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];

    service.getCategoryData().subscribe((categories) => {
      expect(categories).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.skillDataUrl}category`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch subcategory data', () => {
    const mockResponse = [{ id: 1, name: 'Subcategory 1' }, { id: 2, name: 'Subcategory 2' }];

    service.getSubCategoryData().subscribe((subcategories) => {
      expect(subcategories).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.skillDataUrl}subcategory`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch skill data', () => {
    const mockResponse = [{ id: 1, name: 'Skill 1' }, { id: 2, name: 'Skill 2' }];

    service.getSkillData().subscribe((skills) => {
      expect(skills).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.skillDataUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch subcategory data by ID', () => {
    const mockResponse = { id: 1, name: 'Subcategory 1' };

    service.getSubCategoryDataByID('1').subscribe((subcategory) => {
      expect(subcategory).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.skillDataUrl}subcategory/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch skill data by ID', () => {
    const mockResponse = { id: 1, name: 'Skill 1' };

    service.getSkillDataByID('1').subscribe((skill) => {
      expect(skill).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.skillDataUrl}1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should add a new skill', () => {
    const newSkill = { name: 'New Skill', level: 'Beginner' };
    const mockResponse = { id: 3, ...newSkill };

    service.addSkill(newSkill).subscribe((skill) => {
      expect(skill).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.userSkillUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSkill);
    req.flush(mockResponse);
  });
});