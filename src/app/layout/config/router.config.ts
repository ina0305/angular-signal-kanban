import { NavGroup } from "../module/route.module";

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Dashboard',
        route: '/',
    },
    {
        label: 'Members',
        expanded: true,
        items: [
            {
                label: 'Member List',
                icon: 'users',
                route: '/members'
            },
            {
                label: 'Add Member',
                icon: 'plus',
                route: '/members/add'
            },
            {
                label: 'Create Member',
                icon: 'user-plus',
                route: '/members/create'
            }
        ]
    },
    {
        label: 'Profile',
        route: '/profile',
    }
];