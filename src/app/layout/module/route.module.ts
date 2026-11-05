interface NavItem {
    label: string;
    icon: string;
    route: string;
}

export interface NavGroup {
    label: string;
    route?: string;
    expanded?: boolean;
    items?: NavItem[];
}