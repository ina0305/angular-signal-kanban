import { Component, inject } from "@angular/core";

// PrimeNG
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from "primeng/button";

// Store
import { MemberStore } from "../store/member.store";

@Component({
    templateUrl: './profile.html',
    selector: 'profile',
    imports: [CardModule, AvatarModule, ButtonModule, TagModule]
})

export class ProfileComponent {
    readonly store = inject(MemberStore);
}