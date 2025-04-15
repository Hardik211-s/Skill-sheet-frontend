import { ChangeDetectorRef, Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {  Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { NAV_ITEMS } from '../../constants/nav-items';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, NavbarComponent, CommonModule, FormsModule, RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  title: string = 'skill-sheet';
  isLoggedIn: boolean = false;
  isShowSidebar: boolean = false;
  myRole: string = ""
  navItems = NAV_ITEMS;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) {
    const role = this.authService.loggedData().userData;
    if (role == 'Admin') {
      this.router.navigate(["/dashboard"])
    } else {
      this.router.navigate(["/showdetail"])
    }
  }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((status) => {
      this.cdr.detectChanges();
      this.isLoggedIn = !!status;
    });
    this.myRole = this.authService.loggedData().userData.Role;
    this.navItems = this.navItems.filter(item => item.role === 'all' || item.role === this.myRole);
    if (this.isLoggedIn) {
      if (this.myRole == "Admin") {
        this.router.navigate(["/dashboard"])
      } else {
        this.router.navigate(["/showdetail"])
      }
    }

  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 576) {
      this.isShowSidebar = false;
    }
  }
  showSidebar() {
    this.isShowSidebar = !this.isShowSidebar;
  }

}
