import { Component, inject } from "@angular/core";

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

// Store
import { MemberStore } from "./feature/store/member.store";



@Component({
    selector: 'app-main-layout',
    imports: [
        ToolbarModule,
        AvatarModule,
        SidebarModule,
        Home,
        Plus,
        User,
        Users,
        RouterOutlet,
        BreadcrumbModule
    ],
    templateUrl: './main-layout.container.html',
    styleUrl: './main-layout.container.css',
})
export class MainLayoutContainer {
    memberStore = inject(MemberStore);
    items: MenuItem[] | undefined;
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

    public router = inject(Router)


    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}