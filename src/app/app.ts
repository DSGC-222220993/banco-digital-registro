import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { delay, map, switchMap, take, filter } from 'rxjs/operators';

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

  mostrarPassword = false;
  mostrarConfirmPassword = false;

  maxFecha = this.calcularFechaMaxima();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑ ]+$'), Validators.minLength(3)]],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailYaRegistradoValidator()]
      }],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]],
      confirmar: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, this.edadMinimaFecha(18)]],
      terminos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.contrasenasCoincidentes
    });
  }

  get f() { return this.registroForm.controls; }

  get stepTitle(): string {
    return ['Your Name', 'Email', 'Password', 'Date of Birth', 'Terms'][this.currentStep - 1];
  }

  get stepDescription(): string {
    return [
      'Enter your full name and continue.',
      'Enter a valid email.',
      'Create and confirm your password.',
      'Provide your birth date.',
      'Accept the terms.'
    ][this.currentStep - 1];
  }

  stepName(step: number): string {
    return ['Your Name', 'Email', 'Password', 'Age', 'Terms'][step - 1];
  }

  stepDescriptionText(step: number): string {
    return [
      'Complete name',
      'Enter email',
      'Password',
      'Age required',
      'Accept terms'
    ][step - 1];
  }

  stepValid(step: number): boolean {
    const control = this.getControlByStep(step);
    if (step === 2) {
      return this.f['email'].valid && !this.f['email'].pending;
    }
    if (step === 3) {
      return this.f['password'].valid && this.f['confirmar'].valid && !this.registroForm.errors?.['noCoinciden'];
    }
    return control ? control.valid : false;
  }

  private getControlByStep(step: number): AbstractControl | null {
    const controls: { [key: number]: string } = {
      1: 'nombre',
      2: 'email',
      4: 'fechaNacimiento',
      5: 'terminos'
    };
    return this.f[controls[step]] || null;
  }

  markCurrentStepTouched(): void {
    const control = this.getControlByStep(this.currentStep);
    if (this.currentStep === 3) {
      this.f['password'].markAsTouched();
      this.f['confirmar'].markAsTouched();
    } else {
      control?.markAsTouched();
    }
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.nextStep();
  }

  nextStep(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.markCurrentStepTouched();

    if (this.currentStep === 2) {
      if (this.f['email'].pending) {
        this.f['email'].statusChanges.pipe(
          filter(status => status !== 'PENDING'),
          take(1)
        ).subscribe(status => {
          if (status === 'VALID') this.currentStep++;
        });
        return;
      }
    }

    if (this.stepValid(this.currentStep) && this.currentStep < 5) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  edadMinimaFecha(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      return edad >= min ? null : { edadMinima: true };
    };
  }

  contrasenasCoincidentes(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmar = group.get('confirmar')?.value;
    return password === confirmar ? null : { noCoinciden: true };
  }

  emailYaRegistradoValidator() {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      const emailsRegistrados = ['test@banco.com', 'admin@banco.com'];
      
      return timer(1500).pipe(
        map(() => {
          const existe = emailsRegistrados.includes(control.value.toLowerCase());
          return existe ? { emailExiste: true } : null;
        })
      );
    };
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleMostrarConfirmPassword(): void {
    this.mostrarConfirmPassword = !this.mostrarConfirmPassword;
  }

  calcularFechaMaxima(): string {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18);
    return hoy.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.mensajeExito = '';

    setTimeout(() => {
      this.enviando = false;
      this.mensajeExito = 'Registration completed successfully!';
      this.registroForm.reset();
      this.currentStep = 1;
      setTimeout(() => this.mensajeExito = '', 5000);
    }, 2000);
  }
}