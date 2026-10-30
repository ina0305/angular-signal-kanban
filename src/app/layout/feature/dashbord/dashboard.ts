import { Component } from "@angular/core";

import { CardModule } from 'primeng/card';

@Component({
    selector: 'dashboard',
    imports: [CardModule],
    templateUrl: './dashboard.html'
})

export class DashboardComponent { }