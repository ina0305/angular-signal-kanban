import { Component, inject } from '@angular/core';

// Form
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG
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
}
