import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./main-layout.container').then((m) => m.MainLayoutContainer),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/dashbord/dashboard').then((m) => m.DashboardComponent)
      },
      {
        path: 'member-list',
        loadComponent: () => import('./feature/member-list/member-list').then((m) => m.MemberListComponent),
      },
      {
        path: 'add-member',
        loadComponent: () => import('./feature/add-member/add-member-form').then((m) => m.AddMemberFormComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/profile/profile').then((m) => m.ProfileComponent)
      }
    ]
  },
];
