import { Component, inject, signal } from "@angular/core";

// Route
import { Router, RouterOutlet } from "@angular/router";

// PrimeNG
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from "primeng/api";

// Primeng icon
import { Home } from '@primeicons/angular/home';
import { User } from '@primeicons/angular/user';
import { Users } from '@primeicons/angular/users';
import { Plus } from '@primeicons/angular/plus';
import { UserPlus } from '@primeicons/angular/user-plus';

// Store
import { MemberStore } from "./feature/store/member.store";
import { NAV_GROUPS } from "./config/router.config";



@Component({
    selector: 'app-main-layout',
    imports: [
        ToolbarModule,
        AvatarModule,
        SidebarModule,
        // Home,
        // Plus,
        // User,
        // Users,
        RouterOutlet,
        BreadcrumbModule,
        // UserPlus
    ],
    templateUrl: './main-layout.container.html',
    styleUrl: './main-layout.container.css',
})
export class MainLayoutContainer {
    memberStore = inject(MemberStore);
    items: MenuItem[] | undefined;
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
    readonly isMembersExpanded = signal(true);
    readonly navGroup = NAV_GROUPS;
    public router = inject(Router)


    navigateTo(route: string) {
        if (route.startsWith('/members')) {
            this.isMembersExpanded.set(true);
        }

        this.router.navigateByUrl(route);
    }

    toggleMembers() {
        this.isMembersExpanded.update((value) => !value);
    }
}