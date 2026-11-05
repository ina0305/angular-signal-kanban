import { Component, inject, input, output } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { TableModule } from "primeng/table";
import { Member, MemberStore } from "../store/member.store";

@Component({
    selector: 'member-list',
    imports: [TableModule, ButtonModule],
    templateUrl: './member-list.component.html'
})

export class MemberListComponent {
    memberStore = inject(MemberStore);

    onDelete(id: string) {
        this.memberStore.deleteMember(id);
    }
}