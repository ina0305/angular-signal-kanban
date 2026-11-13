import { NavGroup } from '../models/route.models';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'labels.dashboard',
    route: '/',
  },
  {
    label: 'labels.members',
    expanded: true,
    items: [
      {
        label: 'labels.memberList',
        icon: 'users',
        route: '/members',
      },
      {
        label: 'labels.addMember',
        icon: 'plus',
        route: '/members/add',
      },
      {
        label: 'labels.createMember',
        icon: 'user-plus',
        route: '/members/create',
      },
    ],
  },
  {
    label: 'labels.profile',
    route: '/profile',
  },
];
