import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonLabel, // Importa IonLabel
} from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    FormsModule,
    ReactiveFormsModule,
    IonText,
    CommonModule,
    IonLabel // Agrega IonLabel a los imports
  ],
})
export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private toastController = inject(ToastController);

  constructor() {}

  async login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';
      try {
        const userCredential = await signInWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        this.router.navigate(['/home']);
      } catch (error: any) {
        const toast = await this.toastController.create({
          message: 'Error al iniciar sesión: ' + error.message,
          duration: 3000,
          position: 'top',
        });
        await toast.present();
      }
    }
  }

  async registrar() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';
      try {
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        this.router.navigate(['/home']);
      } catch (error: any) {
        const toast = await this.toastController.create({
          message: 'Error al registrarse: ' + error.message,
          duration: 3000,
          position: 'top',
        });
        await toast.present();
      }
    }
  }

  async resetPassword() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email ?? '';
      try {
        await sendPasswordResetEmail(this.auth, email);
        const toast = await this.toastController.create({
          message: 'Correo de recuperación enviado a ' + email,
          duration: 3000,
          position: 'top',
        });
        await toast.present();
        this.router.navigate(['/login']);
      } catch (error: any) {
        const toast = await this.toastController.create({
          message: 'Error al enviar correo de recuperación: ' + error.message,
          duration: 3000,
          position: 'top',
        });
        await toast.present();
      }
    }
  }
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}