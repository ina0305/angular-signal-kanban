import { Component, inject, signal } from '@angular/core';

// Form
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Route
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

// PrimeNG icon
import { Spinner } from '@primeicons/angular/spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MemberStore } from '../../service/member.store';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  imports: [
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RadioButtonModule,
    DatePickerModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    Spinner,
    TranslatePipe,
  ],
  selector: 'app-create-member',
  styleUrl: './create-member.component.css',
  templateUrl: './create-member.component.html',
})
export class CreateMemberComponent {
  private fb = inject(FormBuilder);
  readonly route = inject(Router);
  readonly store = inject(MemberStore);

  createInfoForm: FormGroup;

  isSubmitting = signal(false);

  roleOptions: SelectOption[] = [
    { label: 'member.role.admin', value: 'admin' },
    { label: 'member.role.user', value: 'user' },
    { label: 'member.role.guest', value: 'guest' },
  ];

  statusOptions: SelectOption[] = [
    { label: 'member.status.active', value: 'active' },
    { label: 'member.status.pending', value: 'pending' },
    { label: 'member.status.inactive', value: 'inactive' },
  ];

  languageOptions: SelectOption[] = [
    { label: 'member.language.english', value: 'en_US' },
    { label: 'member.language.traditionalChinese', value: 'zh_TW' },
    { label: 'member.language.japanese', value: 'Ja_jp' },
  ];

  timeZoneOptions: SelectOption[] = [
    { label: 'member.timeZone.utc8', value: 'utc8' },
    { label: 'member.timeZone.utc9', value: 'utc9' },
    { label: 'member.timeZone.utc0', value: 'utc0' },
  ];

  constructor() {
    this.createInfoForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^09\d{8}$/)]],
      gender: ['male'],
      birth: [''],
      role: ['guest'],
      status: ['active'],
      language: ['zh_TW'],
      timeZone: ['utc8'],
      note: [''],
    });
  }

  onCancel() {
    this.route.navigate(['/members']);
  }

  async onSubmit() {
    if (this.createInfoForm.invalid) {
      this.createInfoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    try {
      // 表單送出後等待 API 完成，再解除 loading 狀態。
      await this.store.createMember(this.createInfoForm.getRawValue());
    } catch (error) {
      console.error('Failed to create member:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
