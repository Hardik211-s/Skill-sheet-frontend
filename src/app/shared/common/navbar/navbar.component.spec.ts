import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../service/auth.service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { Router } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout'], {
      loggedIn$: of(true), // Mock the loggedIn$ observable
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [],
      providers: [NavbarComponent,
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChangeDetectorRef, useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']) },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to loggedIn$ and update isLoggedIn on ngOnInit', () => {
    component.ngOnInit();

    expect(authService.loggedIn$).toBeDefined();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should toggle sidebar and main classes on changeUI', () => {
    const sidebarMock = { nativeElement: { classList: { toggle: jasmine.createSpy('toggle') } } };
    const mainMock = { nativeElement: { classList: { toggle: jasmine.createSpy('toggle') } } };

    component.sidebar = sidebarMock as ElementRef;
    component.main = mainMock as ElementRef;

    component.changeUI();

    expect(sidebarMock.nativeElement.classList.toggle).toHaveBeenCalledWith('expand');
    expect(mainMock.nativeElement.classList.toggle).toHaveBeenCalledWith('expanded');
  });

   
});