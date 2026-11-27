import { Component, inject } from '@angular/core';

// PrimeNG
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

// Store
import { MemberStore } from '../service/member.store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './profile.component.html',
  selector: 'profile',
  imports: [CardModule, AvatarModule, ButtonModule, TagModule, TranslatePipe],
})
export class ProfileComponent {
  readonly store = inject(MemberStore);
  translate = inject(TranslateService);

  constructor() {
    console.log(this.translate.currentLang);
  }
}
