import { Component, inject, signal } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

// PrimeNG
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { Home } from '@primeicons/angular/home';
import { Plus } from '@primeicons/angular/plus';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from "primeng/api";
import { MemberStore } from "./feature/store/member.store";



@Component({
    selector: 'app-main-layout',
    imports: [
        ToolbarModule,
        AvatarModule,
        SidebarModule,
        Home,
        Plus,
        RouterOutlet,
        BreadcrumbModule
    ],
    templateUrl: './main-layout.container.html',
})
export class MainLayoutContainer {
    memberStore = inject(MemberStore);
    items: MenuItem[] | undefined;
    home: MenuItem = { icon: 'pi pi-home', routerLink: '' };

    router = inject(Router)


    navigateTo(path: string) {
        this.router.navigate([path]);
        this.memberStore.setBreadcrumbs([{ label: path, routerLink: path }])
    }



}