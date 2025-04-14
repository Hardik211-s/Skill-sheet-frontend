import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { catchError, throwError } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { SkilldataService } from '../../../service/skilldata.service';
import { CategoryResponse, Skill, SkillCategory, SkillResponse, SkillSubCategory, SubCategoryResponse } from '../../../interface/skill';
import { Proficieny } from '../../../enums/proficieny';
@Component({
  selector: 'add-skill.component',
  templateUrl: 'add-skill.component.html',
  styleUrl: 'add-skill.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule, MatSelectModule, MatSliderModule, CommonModule
  ],
  standalone: true

})
export class AddSkillComponent implements OnInit {

  myvalue: number = 0;
  skillCategory: SkillCategory[] = []
  skillSubCategory: SkillSubCategory[] = []
  skills: Skill[] = []
  proficiency: typeof Proficieny = Proficieny;
  private _formBuilder = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
    proficiency: ['', Validators.required],
    experience: ['', Validators.required],
  });

  constructor(private authService: AuthService, private skillDataService: SkilldataService) { }

  ngOnInit(): void {
    this.skillDataService.getCategoryData().pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    ).subscribe((res: CategoryResponse) => {
      this.skillCategory = res.category;
    })

  }

  formatLabel(value: number): string {
    this.myvalue = value;
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Remove', {
      horizontalPosition: "right",
      verticalPosition: 'bottom',
    });
  }


  OnCategory() {
    this.skillDataService.getSubCategoryDataByID(this.firstFormGroup.get('firstCtrl')?.value).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    ).subscribe((res: SubCategoryResponse) => {
      this.skillSubCategory = res.subCategory;
    })

  }

  OnSubcategory() {
    this.skillDataService.getSkillDataByID(this.secondFormGroup.get('secondCtrl')?.value).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    ).subscribe((res: SkillResponse) => {
      this.skills = res.skills;
    })
  }

  resetStepper(fileInput2: HTMLInputElement) {
    fileInput2.click();
  }

  OnSkill(fileInput: HTMLInputElement, fileInput2: HTMLInputElement) {
    this.skillDataService.addSkill({
      userId: Number(this.authService.loggedData().userData.UserId), myId: this.thirdFormGroup
        .get('thirdCtrl')?.value, proficiencyLevel: this.thirdFormGroup
          .get('proficiency')?.value,
      experience: this.thirdFormGroup
        .get('experience')?.value
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    ).subscribe((res) => {
      fileInput.click()
      fileInput2.click()
    })
  }
}
