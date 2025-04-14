import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/envoronment';
import { NgModule } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  }); 

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set login data when token exists in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mockToken');
    spyOn(service, 'decodeToken');
    spyOn(service['loggedInSubject'], 'next');

    service.setLoginData();

    expect(service.token).toBe('mockToken');
    expect(service.decodeToken).toHaveBeenCalled();
    expect(service['loggedInSubject'].next).toHaveBeenCalledWith(true);
  });

  it('should call login API and return response', () => {
    const mockUserData = { username: 'testuser', password: 'password', role: 'User' };
    const mockResponse = { token: 'mockToken' };

    service.login(mockUserData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.authUrl}login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call getAllUser API and return response', () => {
    const mockResponse = { allUsers: [{ username: 'testuser', email: 'test@example.com', role: 'User' }] };

    service.getAllUser().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.authUrl}alluser`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call registerUser API and return response', () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const mockResponse = { message: 'User registered successfully' };

    service.registerUser(mockUserData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.authUrl}register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call updateUser API and return response', () => {
    const mockUserData = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const mockResponse = { message: 'User updated successfully' };

    service.updateUser(mockUserData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.authUrl}update`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should call deleteUser API and return response', () => {
    const username = 'testuser';
    const mockResponse = { message: 'User deleted successfully' };

    service.deleteUser(username).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.authUrl}delete/${username}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should call changeUserPassword API and return response', () => {
    const mockPasswordData = 'newPassword';
    const mockResponse = { message: 'Password changed successfully' };

    service.changeUserPassword(mockPasswordData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.authUrl}password`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

   

  it('should log out the user', () => {
    spyOn(service['loggedInSubject'], 'next');
    spyOn(service['userDataSubject'], 'next');

    service.logout();

    expect(service['loggedInSubject'].next).toHaveBeenCalledWith(false);
    expect(service['userDataSubject'].next).toHaveBeenCalledWith(null);
  });

  it('should set user data and update subjects', () => {
    const mockUserData = { username: 'testuser', role: 'User' };
    spyOn(service['loggedInSubject'], 'next');
    spyOn(service['userDataSubject'], 'next');

    service.setUserData(mockUserData);

    expect(service['loggedInSubject'].next).toHaveBeenCalledWith(true);
    expect(service['userDataSubject'].next).toHaveBeenCalledWith(mockUserData);
  });

  it('should return logged data', () => {
    const mockLoggedIn = true;
    const mockUserData = { username: 'testuser', role: 'User' };

    spyOn(service['loggedInSubject'], 'getValue').and.returnValue(mockLoggedIn);
    spyOn(service['userDataSubject'], 'getValue').and.returnValue(mockUserData);

    const result = service.loggedData();

    expect(result).toEqual({ isLoggedIn: mockLoggedIn, userData: mockUserData });
  });
});