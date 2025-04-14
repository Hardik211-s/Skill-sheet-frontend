import { Injectable } from '@angular/core';
import { environment } from '../../environments/envoronment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserskillService {

  userSkillApiUrl :string=environment.userSkillUrl

  constructor(private http:HttpClient) { }

  getUserSkillData(): Observable<any> {
    return this.http.get(this.userSkillApiUrl);
  }

  getUserSkillDataByID(userID:number): Observable<any> {
    return this.http.get(this.userSkillApiUrl+userID);
  }

  addUserSkillData(skilldata:any): Observable<any> {
    return this.http.post(this.userSkillApiUrl,skilldata);
  }


  updateUserSkillData(skilldata:any): Observable<any> {
    return this.http.patch(this.userSkillApiUrl,skilldata);
  }

  deleteUserSkillData(userSkillId:any): Observable<any> {
    return this.http.delete(this.userSkillApiUrl+userSkillId);
  }
}
