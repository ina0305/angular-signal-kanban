import { Component, inject, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MemberStore } from '../../store/member.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'member-list',
  imports: [TableModule, ButtonModule, TranslatePipe],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent {
  memberStore = inject(MemberStore);

  onDelete(id: string) {
    this.memberStore.deleteMember(id);
  }
}
