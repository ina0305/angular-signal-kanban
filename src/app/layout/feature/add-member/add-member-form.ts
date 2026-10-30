import { Component, inject, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MemberStore } from "../store/member.store";

@Component({
  selector: 'add-member-form',
  imports: [
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './add-member-form.html',
})
export class AddMemberFormComponent {
  readonly memberStore = inject(MemberStore)
  name = signal('');
  email = signal('');
  role = signal('Viewer');

  readonly roleOptions = [
    {
      label: 'Admin', value: 'admin'
    },
    {
      label: 'Edittor', value: 'edittor'
    },
    { label: 'Viewer', value: 'viwer' }
  ];

  // memberAdded = output<{ name: string; email: string; role: string }>();

  onSubmit() {
    if (!this.name() || !this.email()) return;

    this.memberStore.addMember({
      name: this.name(),
      email: this.email(),
      role: this.role()
    })

    this.name.set('');
    this.email.set('');
    this.role.set('Viewer');
  }
}