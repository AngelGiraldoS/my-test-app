import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  docData,
  collectionData,
} from '@angular/fire/firestore';
import { Task } from '../models/task.model'; 
import { Observable, from, of } from 'rxjs';
import { AuthService } from './auth.service'; 
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
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

  // Añadir una tarea a Firestore
  addTask(task: Task): Observable<string> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);
        return from(addDoc(tasksCollection, { ...task, userId })).pipe(
          switchMap((docRef) => of(docRef.id))
        );
      })
    );
  }

  // Obtener tareas de Firestore
  getTasks(): Observable<Task[]> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          return of([]);
        }
        const tasksCollection = collection(this.firestore, `users/${userId}/tasks`);
        const q = query(tasksCollection);
        return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
      })
    );
  }

  // Obtener una tarea por ID
  getTask(id: string): Observable<Task> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const taskDocRef = doc(this.firestore, `users/${userId}/tasks/${id}`);
        return docData(taskDocRef, { idField: 'id' }) as Observable<Task>;
      })
    );
  }

  // Actualizar una tarea
  updateTask(task: Task): Observable<void> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const taskDocRef = doc(this.firestore, `users/${userId}/tasks/${task.id}`);
        return from(updateDoc(taskDocRef, { ...task }));
      })
    );
  }

  // Eliminar una tarea
  deleteTask(id: string): Observable<void> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }
        const taskDocRef = doc(this.firestore, `users/${userId}/tasks/${id}`);
        return from(deleteDoc(taskDocRef));
      })
    );
  }
}