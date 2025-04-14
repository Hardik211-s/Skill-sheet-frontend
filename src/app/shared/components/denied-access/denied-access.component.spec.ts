import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { DeniedAccessComponent } from './denied-access.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('DeniedAccessComponent', () => {
  let component: DeniedAccessComponent;
  let fixture: ComponentFixture<DeniedAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule,RouterTestingModule],
      providers: [DeniedAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeniedAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
