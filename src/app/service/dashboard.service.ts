import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/envoronment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService { 
  dashboardApiUrl: string = environment.dashboardUrl

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get(this.dashboardApiUrl);
  }
}
