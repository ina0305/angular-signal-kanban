import { Component, inject, input, output } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { TableModule } from "primeng/table";
import { Member, MemberStore } from "../store/member.store";

@Component({
    selector: 'member-list',
    imports: [TableModule, ButtonModule],
    templateUrl: './member-list.html'
})

export class MemberListComponent {
    memberStore = inject(MemberStore);
    // members = input<Member[]>([]);
    // memberDeleted = output<string>();

    onDelete(id: string) {
        this.memberStore.deleteMember(id);
        // this.memberDeleted.emit(id);
    }
}