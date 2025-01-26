import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Category } from '../models/category.model';
import { Observable, from, of } from 'rxjs';
import { AuthService } from './auth.service'; 
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Obtener un observable con el ID del usuario actual
  private userId$ = this.authService.user$.pipe(
    switchMap((user) => {
      if (user) {
        return of(user.uid);
      } else {
        return of(null);
      }
    })
  );

  // Añadir una categoría a Firestore
  addCategory(category: Category): Observable<string> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const categoriesCollection = collection(this.firestore, `users/${userId}/categories`);
        return from(addDoc(categoriesCollection, { ...category, userId })).pipe(
          switchMap((docRef) => of(docRef.id))
        );
      })
    );
  }

  // Obtener categorías de Firestore
  getCategories(): Observable<Category[]> { // Especifica el tipo de retorno
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          return of([]); // No hay usuario, retornar array vacío
        }
        const categoriesCollection = collection(this.firestore, `users/${userId}/categories`);
        const q = query(categoriesCollection);
        return collectionData(q, { idField: 'id' }) as Observable<Category[]>; // Especifica el tipo
      })
    );
  }

  // Actualizar una categoría
  updateCategory(category: Category): Observable<void> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const categoryDocRef = doc(this.firestore, `users/<span class="math-inline">\{userId\}/categories/</span>{category.id}`);
        return from(updateDoc(categoryDocRef, { ...category }));
      })
    );
  }

  // Eliminar una categoría
  deleteCategory(id: string): Observable<void> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const categoryDocRef = doc(this.firestore, `users/<span class="math-inline">\{userId\}/categories/</span>{id}`);
        return from(deleteDoc(categoryDocRef));
      })
    );
  }
}