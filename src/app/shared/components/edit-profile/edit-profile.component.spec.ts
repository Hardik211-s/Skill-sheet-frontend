import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { EditProfileComponent } from './edit-profile.component';
import { UserdetailService } from '../../../service/userdetail.service';
import { UserDetail } from '../../../interface/userdetail';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let userDetailService: jasmine.SpyObj<UserdetailService>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,EditProfileComponent], // Import HttpClientTestingModule here
      declarations: [],
      providers: [ 
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    userDetailService = TestBed.inject(UserdetailService) as jasmine.SpyObj<UserdetailService>;
    cdr = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
 
});