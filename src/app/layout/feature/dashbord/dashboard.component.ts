import { Component, inject } from '@angular/core';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MemberStore } from '../service/member.store';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'dashboard',
  imports: [CardModule, ButtonModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  store = inject(MemberStore);
  router = inject(Router);

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
