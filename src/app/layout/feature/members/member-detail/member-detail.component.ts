import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  imports: [
    CardModule
  ],
  selector: 'app-member-detail.component',
  styleUrl: './member-detail.component.css',
  templateUrl: './member-detail.component.html',
})
export class MemberDetailComponent {}
