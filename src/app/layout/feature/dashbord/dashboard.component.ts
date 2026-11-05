import { Component, inject } from "@angular/core";

// PrimeNG
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { MemberStore } from "../store/member.store";
import { Router } from "@angular/router";

@Component({
    selector: 'dashboard',
    imports: [CardModule, ButtonModule],
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
    store = inject(MemberStore)
    router = inject(Router)

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}