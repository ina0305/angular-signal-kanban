interface NavItem {
    label: string;
    icon: string;
    route: string;
}

interface NavGroup {
    label: string;
    route?: string;
    expanded: boolean;
    items?: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Dashboard',
        route: '/',
        expanded: true,
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
        expanded: true,
    }
];