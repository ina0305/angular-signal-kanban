import { Component, effect, inject, signal } from '@angular/core';

// Form
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// PrimeNG icon
import { Spinner } from '@primeicons/angular/spinner';

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
    ToastModule,
    Spinner
  ],
  selector: 'app-create-member',
  styleUrl: './create-member.component.css',
  templateUrl: './create-member.component.html',
})

export class CreateMemberComponent {
  private fb = inject(FormBuilder);
  readonly route = inject(Router);
  // readonly messageService = inject(MessageService);
  createInfoForm: FormGroup;

  isSubmitting = signal(false);

  roleOptions: SelectOption[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Member', value: 'member' },
    { label: 'Guest', value: 'guest' }
  ]

  statusOptions: SelectOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Inactive', value: 'inactive' }
  ]

  languageOptions: SelectOption[] = [
    { label: 'English', value: 'en_US' },
    { label: '繁體中文', value: 'zh_TW' },
    { label: '日本語', value: 'Ja_jp' }
  ]

  timeZoneOptions: SelectOption[] = [
    { label: 'UTC+8', value: 'utc8' },
    { label: 'UTC+9', value: 'utc9' },
    { label: 'UTC+0', value: 'utc0' }
  ]

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
      note: ['']
    })
  }


  onCancel() {
    this.route.navigate(['/members']);
  }

  onSubmit() {
    if (this.createInfoForm.invalid) {
      this.createInfoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      console.log(this.createInfoForm.value);
      this.isSubmitting.set(false);
    }, 2000);
  }
}
