import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent,HttpClientModule]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it(`should have as title 'skill-sheet'`, () => {
		expect(component.title).toEqual('skill-sheet');
	});
	
});