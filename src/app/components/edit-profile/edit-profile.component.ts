import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PersonalDetailComponent } from '../personal-detail/personal-detail.component'; 
import { UserDetail } from '../../interface/userdetail';
import { UserdetailService } from '../../service/userdetail.service';

@Component({
  selector: 'app-edit-profile',
  imports: [PersonalDetailComponent, PersonalDetailComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  userDeatil: UserDetail = {
    userId: 0,
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

  constructor(private userDetailService: UserdetailService, private cdr: ChangeDetectorRef) {
    this.userDetailService.toggleEdit();
  }

  ngOnInit(): void {
    this.userDetailService.userData$.subscribe((data) => {
      this.cdr.detectChanges();
      this.userDeatil = this.userDetailService.getData(); // Manually trigger change detection
    });
  }
}
