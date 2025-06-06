import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../service/dashboard.service';
import { ChartData, UserAllData, UserCountData, UserDetail } from '../../interface/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  allUserDetail: Object = {}
  barChartData: ChartData[] = []
  chartLabels: string[] = ['Programming', 'Web Dev.', 'Cloud comp.', 'DevOps', 'Data Science', 'Soft Skill', 'Al/Ml'];
  userCountData: UserCountData = {
    programming: 0,
    webdev: 0,
    cloud: 0,
    devops: 0,
    datascience: 0,
    soft: 0,
    aiml: 0
  }
  pieChart: any;
  allData: any = {
    userAllData: [],
    experienceAVG: 0,
    totalSkill: 0,
    totalUser: 0
  };

  public barChartOptions = {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: { display: true }
    }
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.dashboardService.getDashboardData().pipe(
      catchError((error) => {
        console.error('Error occurred while fetching dashboard data:', error);
        return throwError(() => new Error('Error fetching category data'));
      })
    ).subscribe({
      next: (res) => {
        this.allData = res
        this.allData = this.allData.data
        this.countSkill()
        this.createChart()
      },
      error: (err) => {
        console.error('Error occurred while fetching dashboard data:', err);
      }
    });

  }

  countSkill() {
    this.userCountData = {
      programming: this.filteredUsers("Programming & Development").length,
      webdev: this.filteredUsers("Web Development").length,
      cloud: this.filteredUsers("Cloud Computing").length,
      devops: this.filteredUsers("DevOps & IT Operations").length,
      datascience: this.filteredUsers("Data Analytics").length,
      soft: this.filteredUsers("Business & Soft Skills").length,
      aiml: this.filteredUsers("Machine Learning").length,
    };
    this.updateChartData()
  }

  updateChartData() {
    this.barChartData = [
      {
        data: [
          7,
          this.userCountData.webdev,
          this.userCountData.cloud,
          this.userCountData.devops,
          this.userCountData.datascience,
          this.userCountData.soft,
          this.userCountData.aiml,
        ],
        label: 'User Count',
        backgroundColor: [
          '#ADD8E6', // Light Blue
          '#90EE90', // Light Green
          '#FF9999', // Light Red
          '#D8BFD8', // Light Purple
          '#FFD580', // Light Orange
        ],
      },
    ];
    this.cdr.detectChanges();
  }

  filteredUsers(search: string) {
    if (this.allData.userAllData != null) {
      return this.allData?.userAllData?.filter((user: { skill: any; category: any; subcategory: any }) =>
        user.skill.includes(search)
        || user.category.includes(search) ||
        user.subcategory.includes(search)
      );
    }
  }

  filterGender(search: string) {
    return this.allData?.allUserDetail?.filter((user: { sex: string }) =>
      user.sex?.includes(search)
    );
  }

  dotNetDev() {
    return this.allData?.allUserDetail?.filter((data: { username: string }) =>
      this.allData.userAllData
        .filter((user: { skill: string }) =>
          ["ASP.NET Core MVC", ".NET Core", "ASP.NET", "Entity Framework"].some((s) =>
            user.skill.includes(s)
          )
        )
        .filter(
          (user: any, index: any, self: any) =>
            index === self.findIndex((u: any) => u.username === user.username)
        ).some((user: { username: string }) => user.username === data.username)
    )
  }

  webDev() {
    return this.allData?.userAllData?.filter((user: { category: string }) =>
      ["Web Development"].some((s) =>
        user.category.includes(s)
      )
    )
      .filter(
        (user: any, index: any, self: any) =>
          index === self.findIndex((u: any) => u.username === user.username)
      ).length;
  }

  createChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    this.pieChart = new Chart('pieChartCanvas', {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [this.filterGender("male")?.length, this.filterGender("female")?.length],
          backgroundColor: ['#90EE90', '#FF9999'],
          borderColor: ['white'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }


}
