import { Component, inject } from '@angular/core';

// Form
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';

// Store
import { MemberStore } from '../../store/member.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'add-member-form',
  imports: [
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    TranslatePipe,
  ],
  templateUrl: './add-member-form.component.html',
})
export class AddMemberFormComponent {
  readonly memberStore = inject(MemberStore);
  private fb = inject(FormBuilder);
  addForm: FormGroup;

  readonly roleOptions = [
    {
      label: 'member.role.admin',
      value: 'admin',
    },
    {
      label: 'member.role.editor',
      value: 'editor',
    },
    { label: 'member.role.viewer', value: 'viewer' },
  ];

  constructor() {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['viewer', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.addForm.invalid) return;
    const formData = this.addForm.value;
    this.memberStore.addMember(formData);
    this.addForm.reset({
      name: '',
      email: '',
      role: 'viewer',
    });
  }
}
