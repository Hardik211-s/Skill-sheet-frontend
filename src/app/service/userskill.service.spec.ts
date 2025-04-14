import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserskillService } from './userskill.service';
import { environment } from '../../environments/envoronment';

describe('UserskillService', () => {
  let service: UserskillService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserskillService],
    });
    service = TestBed.inject(UserskillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all user skills', () => {
    const mockResponse = [
      { id: 1, skill: 'JavaScript', level: 'Intermediate' },
      { id: 2, skill: 'Angular', level: 'Advanced' },
    ];

    service.getUserSkillData().subscribe((skills) => {
      expect(skills.length).toBe(2);
      expect(skills).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.userSkillUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch user skill data by ID', () => {
    const mockSkill = { id: 1, skill: 'JavaScript', level: 'Intermediate' };

    service.getUserSkillDataByID(1).subscribe((skill) => {
      expect(skill).toEqual(mockSkill);
    });

    const req = httpMock.expectOne(`${environment.userSkillUrl}1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSkill);
  });

  it('should add new user skill data', () => {
    const newSkill = { skill: 'React', level: 'Beginner' };
    const mockResponse = { id: 3, ...newSkill };

    service.addUserSkillData(newSkill).subscribe((skill) => {
      expect(skill).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.userSkillUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSkill);
    req.flush(mockResponse);
  });

  it('should update existing user skill data', () => {
    const updatedSkill = { id: 1, skill: 'JavaScript', level: 'Advanced' };

    service.updateUserSkillData(updatedSkill).subscribe((skill) => {
      expect(skill).toEqual(updatedSkill);
    });

    const req = httpMock.expectOne(`${environment.userSkillUrl}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedSkill);
    req.flush(updatedSkill);
  });

  it('should delete user skill data', () => {
    service.deleteUserSkillData(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.userSkillUrl}1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});