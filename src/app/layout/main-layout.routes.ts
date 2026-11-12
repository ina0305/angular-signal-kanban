import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main-layout.container').then((m) => m.MainLayoutContainer),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/dashbord/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        data: { breadcrumb: [] },
      },
      {
        path: 'members',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./feature/members/member-list/member-list.component').then(
                (m) => m.MemberListComponent,
              ),
            data: {
              breadcrumb: [
                { key: 'breadcrumb.members' },
                { key: 'breadcrumb.memberList' },
              ],
            },
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./feature/members/add-member/add-member-form.component').then(
                (m) => m.AddMemberFormComponent,
              ),
            data: {
              breadcrumb: [
                { key: 'breadcrumb.members' },
                { key: 'breadcrumb.addMember' },
              ],
            },
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./feature/members/create-member/create-member.component').then(
                (m) => m.CreateMemberComponent,
              ),
            data: {
              breadcrumb: [
                { key: 'breadcrumb.members' },
                { key: 'breadcrumb.createMember' },
              ],
            },
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./feature/members/member-detail/member-detail.component').then(
                (m) => m.MemberDetailComponent,
              ),
            data: {
              breadcrumb: [
                { key: 'breadcrumb.members' },
                { key: 'breadcrumb.memberDetail' },
              ],
            },
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./feature/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
        data: { breadcrumb: [{ key: 'breadcrumb.profile' }] },
      },
    ],
  },
];
