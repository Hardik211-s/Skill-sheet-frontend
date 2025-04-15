import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component'; 
import { NavbarComponent } from './shared/common/navbar/navbar.component';
import { AddUserAdminComponent } from './components/add-user-admin/add-user-admin.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { DeniedAccessComponent } from './components/denied-access/denied-access.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AddSkillComponent } from './components/add-skill/add-skill.component';
import { MySkillComponent } from './components/my-skill/my-skill.component';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { PersonalDetailComponent } from './components/personal-detail/personal-detail.component';
import { FindUserComponent } from './components/find-user/find-user.component';
import { RoleGuard } from './core/role.guard';

export const routes: Routes = [ 
    
    {
        path:"login",
        component:LoginComponent
    },{
        path:"dashboard",
        component:DashboardComponent,canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' }
    }, {
        path:"navbar",
        component:NavbarComponent,

    },{
        path:"find",
        component:FindUserComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' }
    },{
        path:"add",
        component:AddUserAdminComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' }

    },{
        path:"manage",
        component:ManageUserComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'Admin' },

    },{
        path:"personal",
        component:PersonalDetailComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' },
    },{
        path:"showdetail",
        component:ShowProfileComponent,

    },{
        path:"access-denied",
        component:DeniedAccessComponent,
    },{
        path:"edit",
        component:EditProfileComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' }

    },{
        path:"skill",
        component:AddSkillComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' }

    }
    ,{
        path:"myskill",
        component:MySkillComponent,
        canActivate:[RoleGuard],
        data: { expectedRole: 'User' }

    }
];
