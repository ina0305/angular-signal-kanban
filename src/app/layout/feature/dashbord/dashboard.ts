import { Component, inject } from "@angular/core";

// PrimeNG
import { ButtonModule } from "primeng/button";
import { CardModule } from 'primeng/card';
import { MemberStore } from "../store/member.store";

@Component({
    selector: 'dashboard',
    imports: [CardModule, ButtonModule],
    templateUrl: './dashboard.html'
})

export class DashboardComponent {
    store = inject(MemberStore)
}