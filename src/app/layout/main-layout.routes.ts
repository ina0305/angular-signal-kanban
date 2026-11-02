import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./main-layout.container').then((m) => m.MainLayoutContainer),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/dashbord/dashboard').then((m) => m.DashboardComponent),
        data: { breadcrumb: [] }
      },
      {
        path: 'member-list',
        loadComponent: () => import('./feature/member-list/member-list').then((m) => m.MemberListComponent),
        data: { breadcrumb: [{ label: '人員清單' }] }
      },
      {
        path: 'add-member',
        loadComponent: () => import('./feature/add-member/add-member-form').then((m) => m.AddMemberFormComponent),
        data: { breadcrumb: [{ label: '增加人員表格' }] }
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/profile/profile').then((m) => m.ProfileComponent),
        data: { breadcrumb: [{ label: '帳號管理' }] }
      }
    ]
  },
];
