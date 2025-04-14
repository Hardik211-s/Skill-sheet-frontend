import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/envoronment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserDetail } from '../interface/userdetail';



@Injectable({
  providedIn: 'root'
})
export class UserdetailService {


  userDetailApiUrl :string= environment.userDetailUrl

  private userDetailSubject = new BehaviorSubject<UserDetail>({
    userId: 0, 
    username: '', sex: '', birthdate: '', joiningDate: ''
    , workJapan: true, country: '', fullName: '', description: '', qualification: '', photo: '', phoneNo: 0, lastname:''
  });

  private isEditPage = new BehaviorSubject<boolean>(false);
  private checkUserDetail = new BehaviorSubject<boolean>(false); 

  userData$ = this.userDetailSubject.asObservable();
  editUser$ = this.isEditPage.asObservable();
  isUserDetail = this.checkUserDetail.asObservable();

  constructor(private http: HttpClient, private authSearvice: AuthService) {
  }
  
  isUserPresent() {
    return this.checkUserDetail.getValue()
  }

  addData(user: Partial<UserDetail>) {
    this.checkUserDetail.next(true)
    this.userDetailSubject.next({ ...this.userDetailSubject.value, ...user });
  }

  toggleEdit() {
    this.isEditPage.next(true);
  }

  getIsEdit() {
    return this.isEditPage.getValue();
  }

  getData() {
    return this.userDetailSubject.getValue();
  }


  userDetailById(id:number){
    return this.http.get(this.userDetailApiUrl +id);
  }

  editUserDetail(userData:any){
    return this.http.patch(this.userDetailApiUrl ,userData);
  }
}
