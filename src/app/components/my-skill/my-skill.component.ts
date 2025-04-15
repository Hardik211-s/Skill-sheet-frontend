import { CommonModule } from '@angular/common'; 
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Router, RouterLink } from '@angular/router'; 
import { UserSkillData } from '../../interface/skill';
import { AuthService } from '../../service/auth.service';
import { UserskillService } from '../../service/userskill.service';

@Component({
  selector: 'app-my-skill',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './my-skill.component.html',
  styleUrl: './my-skill.component.scss'
})

export class MySkillComponent implements OnInit {
  searchText: string = ""
  userSkill: UserSkillData[] = []
  selectedSkill: UserSkillData = {
    userSkillId: 0,
    skill: '',
    proficiencyLevel: '',
    subcategory: '',
    category: '',
    experience: 0,
    iconName: '',
    username: ''
  }
  userRequestData: any = {}


  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  private _snackBar = inject(MatSnackBar);
  editUserForm = new FormGroup({
    proficiency: new FormControl('', [Validators.required]),
    experience: new FormControl('', [Validators.required]),
  });

  constructor(private authSearvice: AuthService, private route: Router, private userSkillService: UserskillService) { }

  ngOnInit(): void {
    this.userSkillService.getUserSkillDataByID(this.authSearvice.loggedData().userData.UserId).pipe(
      catchError((error) => {
        console.error("Error occurred:", error);
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res:any) => {
      this.userSkill = res.userSkill;
    })
    this.editUserForm.get('proficiency')?.setValue('');  
    this.editUserForm.get('experience')?.setValue('');  
    this.editUserForm.get('experience')?.markAsUntouched();
    // this.editUserForm.get('proficiency')?.markAsUntouched ;
    // this.editUserForm.get('experience')?.markAsPristine;
    this.editUserForm.markAsUntouched();
  }

  get filteredUsers() {
    return this.userSkill.filter((user: { skill: any; category: any; subcategory: any }) =>
      user.skill.toLowerCase().includes(this.searchText) ||
      user.category.toLowerCase().includes(this.searchText) ||
      user.subcategory.toLowerCase().includes(this.searchText)
    );
  }


  selectSkill(skill: any) {
    this.selectedSkill = skill
  }

  editSkill(closeModal: HTMLButtonElement) {
    this.userRequestData = {
      proficiencyLevel: this.editUserForm.get('proficiency')?.value,
      experience: this.editUserForm.get('experience')?.value,
      userId: 0,
      skillId: 0,
      userskillId: this.selectedSkill.userSkillId,
    }
    this.userSkillService.updateUserSkillData(this.userRequestData).pipe(
      catchError((error) => {
        this._snackBar.open(error.error.message, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this._snackBar.open('Skill Edited !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });
      this.ngOnInit()
    })
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  deleteSkill(closeModal1: HTMLButtonElement) {
    this.userSkillService.deleteUserSkillData(this.selectedSkill.userSkillId).pipe(
      catchError((error) => {
        this._snackBar.open(error.error.message, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        if (this.closeModal) {
          this.closeModal.nativeElement.click();
        }
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this._snackBar.open('Skill Delete !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });
      this.ngOnInit()
      this.route.navigate(['/myskill'])
    })
    if (this.closeModal1) {
      this.closeModal1.nativeElement.click();
    }
  }

}
