import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/envoronment';

@Injectable({
  providedIn: 'root'
})
export class SkilldataService {


  skillDataApiUrl:string=environment.skillDataUrl
  userSkillApiUrl:string=environment.userSkillUrl

  constructor(private http:HttpClient) { }

  getCategoryData(): Observable<any> {
    return this.http.get(this.skillDataApiUrl+'category');
  }
  
  getSubCategoryData(): Observable<any> {
    return this.http.get(this.skillDataApiUrl+'subcategory');
  }

  getSkillData(): Observable<any> {
    return this.http.get(this.skillDataApiUrl);
  }

  getSubCategoryDataByID(id:string | null | undefined): Observable<any> {
    return this.http.get(this.skillDataApiUrl+'subcategory/'+id);
  }

  getSkillDataByID(id:string | null | undefined ): Observable<any> {
    return this.http.get(this.skillDataApiUrl+id);
  }

  addSkill(skilldata:any): Observable<any> {
    return this.http.post(environment.userSkillUrl,skilldata);
  }
}
