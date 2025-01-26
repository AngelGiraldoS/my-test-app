import { Injectable, inject } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail, // Importa sendPasswordResetEmail
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Observable, from, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  public user$ = new Observable<any>((observer) => {
    onAuthStateChanged(this.auth, (user) => {
      observer.next(user);
    });
  });

  constructor() {}

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  logout(): Observable<any> {
    return from(signOut(this.auth));
  }

  // Método para enviar el correo de recuperación de contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }

    async registerUser(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async loginUser(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }
}