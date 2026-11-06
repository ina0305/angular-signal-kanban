import { Component, inject } from "@angular/core";

// Form
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

// PrimeNG
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from "primeng/card";

// Store
import { MemberStore } from "../../store/member.store";


@Component({
  selector: 'add-member-form',
  imports: [
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule
  ],
  templateUrl: './add-member-form.component.html',
})

export class AddMemberFormComponent {
  readonly memberStore = inject(MemberStore);
  private fb = inject(FormBuilder);
  addForm: FormGroup;

  readonly roleOptions = [
    {
      label: 'Admin', value: 'admin'
    },
    {
      label: 'Edittor', value: 'edittor'
    },
    { label: 'Viewer', value: 'viewer' }
  ];

  constructor() {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['viewer', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.addForm.invalid) return;
    const formData = this.addForm.value;
    this.memberStore.addMember(formData);
    this.addForm.reset({
      name: '',
      email: '',
      role: 'viewer'
    })
  }
}