import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../service/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { Chart } from 'chart.js';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    const dashboardServiceMock = jasmine.createSpyObj('DashboardService', [
      'getDashboardData',
    ]);

    // Mock the `getDashboardData` method
    dashboardServiceMock.getDashboardData.and.returnValue(
      of({
        data: {
          userAllData: [
            {
              skill: 'Programming',
              category: 'Programming & Development',
              subcategory: 'Frontend',
            },
            {
              skill: 'Web Development',
              category: 'Web Development',
              subcategory: 'Backend',
            },
          ],
          allUserDetail: [
            { username: 'user1', sex: 'male' },
            { username: 'user2', sex: 'female' },
          ],
          experienceAVG: 5,
          totalSkill: 10,
          totalUser: 2,
        },
      })
    );

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        DashboardComponent,
        { provide: DashboardService, useValue: dashboardServiceMock },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(
      DashboardService
    ) as jasmine.SpyObj<DashboardService>;
    cdr = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch dashboard data on ngOnInit', () => {
    component.ngOnInit();

    expect(dashboardService.getDashboardData).toHaveBeenCalled();
    expect(component.allData.userAllData.length).toBe(2);
    expect(component.allData.allUserDetail.length).toBe(2);
  });

  it('should count skills correctly in countSkill method', () => {
    component.allData.userAllData = [
      {
        skill: 'Programming',
        category: 'Programming & Development',
        subcategory: 'Frontend',
      },
      {
        skill: 'Web Development',
        category: 'Web Development',
        subcategory: 'Backend',
      },
    ];

    component.countSkill();

    expect(component.userCountData.programming).toBe(1);
    expect(component.userCountData.webdev).toBe(1);
  });

  it('should filter users by skill in filteredUsers method', () => {
    component.allData.userAllData = [
      {
        skill: 'Programming',
        category: 'Programming & Development',
        subcategory: 'Frontend',
      },
      {
        skill: 'Web Development',
        category: 'Web Development',
        subcategory: 'Backend',
      },
    ];

    const filtered = component.filteredUsers('Programming');

    expect(filtered.length).toBe(1);
    expect(filtered[0].skill).toBe('Programming');
  });

  it('should filter .NET developers in dotNetDev method', () => {
    component.allData.userAllData = [
      { skill: 'ASP.NET Core MVC', username: 'user1' },
      { skill: 'JavaScript', username: 'user2' },
    ];
    component.allData.allUserDetail = [
      { username: 'user1' },
      { username: 'user2' },
    ];

    const dotNetDevs = component.dotNetDev();

    expect(dotNetDevs.length).toBe(1);
    expect(dotNetDevs[0].username).toBe('user1');
  });

  it('should filter web developers in webDev method', () => {
    component.allData.userAllData = [
      { category: 'Web Development', username: 'user1' },
      { category: 'Programming & Development', username: 'user2' },
    ];

    const webDevs = component.webDev();

    expect(webDevs).toBe(1);
  });
});
