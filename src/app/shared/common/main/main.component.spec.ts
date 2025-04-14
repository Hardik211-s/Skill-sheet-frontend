import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MainComponent } from './main.component';
import { AuthService } from '../../../service/auth.service';
import { NAV_ITEMS } from '../../../constants/nav-items';
import { ChangeDetectorRef } from '@angular/core';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['loggedData'], {
      loggedIn$: of(true), // Mock the loggedIn$ observable
    });

    // Mock the `loggedData` method
    authServiceMock.loggedData.and.returnValue({
      userData: { Role: 'Admin', username: 'testuser' },
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MainComponent,
        { provide: AuthService, useValue: authServiceMock },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cdr = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn and myRole on ngOnInit', () => {
    component.ngOnInit();

    expect(authService.loggedIn$).toBeDefined();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.myRole).toBe('Admin');
  });

  it('should filter navItems based on role on ngOnInit', () => {
    component.ngOnInit();

    const filteredNavItems = NAV_ITEMS.filter(
      (item) => item.role === 'all' || item.role === 'Admin'
    );

    expect(component.navItems).toEqual(filteredNavItems);
  });

  it('should navigate to /dashboard if role is Admin and user is logged in', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.ngOnInit();

    expect(routerSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to /showdetail if role is not Admin and user is logged in', () => {
    authService.loggedData.and.returnValue(
   { isLoggedIn: true,userData:{Role: 'User', username: 'testuser'  } },
    );
    const routerSpy = spyOn(component['router'], 'navigate');

    component.ngOnInit();

    expect(routerSpy).toHaveBeenCalledWith(['/showdetail']);
  });

  it('should toggle isShowSidebar when showSidebar is called', () => {
    component.isShowSidebar = false;

    component.showSidebar();

    expect(component.isShowSidebar).toBeTrue();

    component.showSidebar();

    expect(component.isShowSidebar).toBeFalse();
  });

  it('should hide sidebar on window resize if width is less than 576px', () => {
    component.isShowSidebar = true;

    component.onResize({ target: { innerWidth: 500 } });

    expect(component.isShowSidebar).toBeTrue();
  });

  it('should not hide sidebar on window resize if width is greater than or equal to 576px', () => {
    component.isShowSidebar = true;

    component.onResize({ target: { innerWidth: 600 } });

    expect(component.isShowSidebar).toBeTrue();
  });
});