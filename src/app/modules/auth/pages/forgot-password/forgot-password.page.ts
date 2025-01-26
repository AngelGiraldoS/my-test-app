import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; 
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
    IonText,
  ],
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email ?? '';
      // Usa from para convertir la promesa en un observable
      from(this.authService.resetPassword(email)).subscribe({
        next: () => {
          // Mostrar mensaje de éxito al usuario
          console.log('Correo de recuperación enviado a:', email);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          // Manejar el error, por ejemplo, mostrar un mensaje al usuario
          console.error('Error al enviar el correo de recuperación:', error);
        },
      });
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}