import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { LoaderComponent } from '../../shared/loader/loader.component';
import { UserDetail } from '../../interface/dashboard';
import { LoggedUser } from '../../interface/auth';
import { UserSkillData } from '../../interface/skill';
import { UserskillService } from '../../service/userskill.service';
import { AuthService } from '../../service/auth.service';
import { UserdetailService } from '../../service/userdetail.service';
import { Proficieny } from '../../shared/enums/proficieny';
@Component({
  selector: 'app-show-profile',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.scss'
})
export class ShowProfileComponent implements OnInit, OnChanges {

  load: boolean = false;
  imageURL: string = '';
  userDetail: UserDetail = {
    userId: 0,
    age: 0,
    email: '',
    lastname: '',
    username: '',
    sex: '',
    birthdate: '',
    joiningDate: '',
    workJapan: false,
    country: '',
    fullName: '',
    description: '',
    qualification: '',
    photo: '',
    phoneNo: 0
  }
  user: LoggedUser = {
    UserId: 0,
    Name: '',
    Email: '',
    Role: ''
  }
  userSkill: UserSkillData[] = []
  userRequestData: any = {}

  @ViewChild('closeModal') closeModal!: ElementRef;
  @Input() userId: number = 0;
  private _snackBar = inject(MatSnackBar);

  constructor(private userSkillService: UserskillService, private router: Router, private authSearvice: AuthService, private userDetailService: UserdetailService, private cdr: ChangeDetectorRef) {
  }

  editUserForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    )]
    ),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    ),
    this.matchValues('newPassword')]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
    ])
  })

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { mismatch: true };
    };
  }


  ngOnInit() {
    this.user = this.authSearvice.loggedData().userData;
    this.loadData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && changes['userId'].currentValue !== changes['userId'].previousValue) {
      this.loadData()
    }
  }

  loadData() {
    this.userDetailService.userDetailById((this.userId == 0) ? this.user.UserId : this.userId).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res: any) => {
      this.userDetail = res.userDetail;
      this.imageURL = "http://localhost:7111/" + this.userDetail.photo;
      this.userDetailService.addData(this.userDetail);
    })

    this.userSkillService.getUserSkillDataByID((this.userId == 0) ? this.user.UserId : this.userId).pipe(
      catchError((error) => {

        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.userSkill = res.userSkill
      this.cdr.detectChanges();
    })
  }

  getProficiencyPercentage(level: string): number {
    switch (level) {
      case Proficieny.Beginner: return 25;
      case Proficieny.Intermediate: return 50;
      case Proficieny.Advanced: return 75;
      case Proficieny.Expert: return 100;
      default: return 0;
    }
  }


  filterCategory(search: string) {
    return this.userSkill.filter((user: { skill: any; category: any; subcategory: any }) =>
      user.skill.includes(search)
      || user.category.includes(search) ||
      user.subcategory.includes(search)
    );
  }

  filterByExcludeSkill() {
    return this.userSkill?.filter((user: { skill: any; category: any; subcategory: any }) =>
      user.category !== 'Programming & Development'
    );
  }

  changePassword(closeModal: HTMLButtonElement) {
    this.load = true;
    this.userRequestData = {
      username: this.user.Name,
      email: this.user.Email,
      password: this.editUserForm.get('password')?.value,
      newPassword: this.editUserForm.get('newPassword')?.value,
      role: this.user.Role,
    }
    this.authSearvice.changeUserPassword(this.userRequestData).pipe(
      catchError((error) => {
        this._snackBar.open('Password Changed !', 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        this.load = false;

        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this._snackBar.open('Password Changed !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });
      if (this.closeModal) {
        this.closeModal.nativeElement.click();
      }
      this.load = false;
      closeModal.click();
    })

  }
}
