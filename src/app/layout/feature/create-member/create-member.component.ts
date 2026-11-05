import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RadioButtonModule,
    DatePickerModule,
    ButtonModule
  ],
  selector: 'app-create-member',
  styleUrl: './create-member.component.css',
  templateUrl: './create-member.component.html',
})
export class CreateMemberComponent {
  private fb = inject(FormBuilder);
  basicInfoForm: FormGroup;

  constructor() {
    this.basicInfoForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^09\d{8}$/)]],
      gender: ['male'],
      birth: ['']
    })
  }

  getErrorMessage(controlName: string): string {
    const control = this.basicInfoForm.get(controlName);

    if (control?.errors?.['required']) {
      return '此欄位為必填';
    }

    if (control?.errors?.['email']) {
      return 'Email 格式不正確';
    }

    if (control?.errors?.['pattern']) {
      return '手機格式不正確';
    }

    return '';
  }

}
