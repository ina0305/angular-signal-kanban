import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MemberStore } from '../../service/member.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'member-list',
  imports: [TableModule, ButtonModule, TranslatePipe],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent {
  memberStore = inject(MemberStore);

  async onDelete(id: string) {
    try {
      // Store 會等 server 確認刪除成功後才更新清單。
      await this.memberStore.deleteMember(id);
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  }
}
