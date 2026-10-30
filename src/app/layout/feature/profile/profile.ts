import { Component } from "@angular/core";

import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
    templateUrl: './profile.html',
    selector: 'profile',
    imports: [CardModule, AvatarModule]
})

export class ProfileComponent { }