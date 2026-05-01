import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  registroForm!: FormGroup;
  enviando = false;
  mensajeExito = '';
  currentStep = 1;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ ]+$'), Validators.minLength(3)]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailYaRegistradoValidator()],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]],
      confirmar: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(1), this.edadMinima(18)]],
      terminos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.contrasenasCoincidentes
    });
  }

  get f() { return this.registroForm.controls; }

  get stepTitle(): string {
    return ['Your Name', 'Email', 'Password', 'Age', 'Terms'][this.currentStep - 1];
  }

  get stepDescription(): string {
    const messages = [
      'Enter your full name and go to the next step.',
      'Enter a valid, available email address.',
      'Create your password and confirm it correctly.',
      'Provide your age to verify the requirements.',
      'Accept the terms to complete your registration.'
    ];

    return messages[this.currentStep - 1];
  }

  stepName(step: number): string {
    return ['Your Name', 'Email', 'Password', 'Age', 'Terms'][step - 1];
  }

  stepDescriptionText(step: number): string {
    return [
      'Complete the name',
      'Complete the email',
      'Password and confirmation',
      'Minimum age required',
      'Accept the terms'
    ][step - 1];
  }

  stepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.f['nombre'].valid;
      case 2:
        return this.f['email'].valid && !this.f['email'].pending;
      case 3:
        return this.f['password'].valid && this.f['confirmar'].valid && !this.registroForm.errors?.['noCoinciden'];
      case 4:
        return this.f['edad'].valid;
      case 5:
        return this.f['terminos'].valid;
      default:
        return false;
    }
  }

  markCurrentStepTouched(): void {
    switch (this.currentStep) {
      case 1:
        this.f['nombre'].markAsTouched();
        break;
      case 2:
        this.f['email'].markAsTouched();
        break;
      case 3:
        this.f['password'].markAsTouched();
        this.f['confirmar'].markAsTouched();
        break;
      case 4:
        this.f['edad'].markAsTouched();
        break;
      case 5:
        this.f['terminos'].markAsTouched();
        break;
    }
  }

  nextStep(): void {
    if (this.stepValid(this.currentStep)) {
      if (this.currentStep < 5) {
        this.currentStep += 1;
      }
    } else {
      this.markCurrentStepTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  edadMinima(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const edad = control.value;
      if (!edad) return null;
      return (edad < min) ? { 'edadMinima': { actual: edad, requerida: min } } : null;
    };
  }

  contrasenasCoincidentes(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmar = group.get('confirmar')?.value;
    return (password === confirmar) ? null : { 'noCoinciden': true };
  }

  emailYaRegistradoValidator() {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      const emailsRegistrados = ['test@banco.com', 'admin@banco.com'];
      return of(control.value).pipe(
        delay(2000),
        map(email => {
          const existe = emailsRegistrados.includes(email.toLowerCase());
          return existe ? { 'emailExiste': true } : null;
        })
      );
    };
  }

  onSubmit() {
    if (this.currentStep !== 5) {
      this.markCurrentStepTouched();
      return;
    }

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.mensajeExito = '';
    console.log('Datos enviados:', this.registroForm.value);

    setTimeout(() => {
      this.enviando = false;
      this.mensajeExito = 'Registration completed successfully! Check your email to activate your account.';
      this.registroForm.reset({
        nombre: '', email: '', password: '', confirmar: '', edad: '', terminos: false
      });
      this.registroForm.markAsUntouched();
      this.currentStep = 1;
    }, 4000);
  }
}
