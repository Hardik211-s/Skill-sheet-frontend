import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserdetailService } from './userdetail.service';
import { environment } from '../../environments/envoronment';
import { UserDetail } from '../interface/userdetail';

describe('UserdetailService', () => {
  let service: UserdetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserdetailService],
    });
    service = TestBed.inject(UserdetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the current user detail', () => {
    const mockUserDetail: UserDetail = {
      userId: 1,
      username: 'testuser',
      sex: 'Male',
      birthdate: '1990-01-01',
      joiningDate: '2020-01-01',
      workJapan: true,
      country: 'Japan',
      fullName: 'Test User',
      description: 'Test description',
      qualification: 'Bachelor',
      photo: 'photo.jpg',
      phoneNo: 1234567890,
      lastname: 'User',
    };

    service.addData(mockUserDetail);
    const userDetail = service.getData();
    expect(userDetail).toEqual(mockUserDetail);
  });

  it('should toggle edit mode', () => {
    service.toggleEdit();
    expect(service.getIsEdit()).toBeTrue();
  });

  it('should check if user detail is present', () => {
    expect(service.isUserPresent()).toBeFalse();
    service.addData({ username: 'testuser' });
    expect(service.isUserPresent()).toBeTrue();
  });

  it('should fetch user detail by ID', () => {
    const mockResponse: UserDetail = {
      userId: 1,
      username: 'testuser',
      sex: 'Male',
      birthdate: '1990-01-01',
      joiningDate: '2020-01-01',
      workJapan: true,
      country: 'Japan',
      fullName: 'Test User',
      description: 'Test description',
      qualification: 'Bachelor',
      photo: 'photo.jpg',
      phoneNo: 1234567890,
      lastname: 'User',
    };

    service.userDetailById(1).subscribe((userDetail) => {
      expect(userDetail).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.userDetailUrl}1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should edit user detail', () => {
    const updatedUserDetail = {
      userId: 1,
      username: 'updateduser',
      sex: 'Male',
      birthdate: '1990-01-01',
      joiningDate: '2020-01-01',
      workJapan: true,
      country: 'Japan',
      fullName: 'Updated User',
      description: 'Updated description',
      qualification: 'Master',
      photo: 'updatedphoto.jpg',
      phoneNo: 9876543210,
      lastname: 'Updated',
    };

    service.editUserDetail(updatedUserDetail).subscribe((response) => {
      expect(response).toEqual(updatedUserDetail);
    });

    const req = httpMock.expectOne(`${environment.userDetailUrl}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedUserDetail);
    req.flush(updatedUserDetail);
  });
});