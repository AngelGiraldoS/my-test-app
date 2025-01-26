import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  ModalController
} from '@ionic/angular/standalone';
import { TaskService } from 'src/app/services/task.service'; 
import { Task } from '../../../../models/task.model';
import { Category } from '../../../../models/category.model';
import { CategoryService } from 'src/app/services/category.service'; 
import { Observable, take, switchMap } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service'; 

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonIcon,
    IonSelect,
    IonSelectOption
  ],
})
export class AddTaskPage {
  private taskService = inject(TaskService);
  private modalController = inject(ModalController);
  categories$: Observable<Category[]>;
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  addTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    categoryId: new FormControl('', [Validators.required]),
  });

  constructor() {
    addIcons({ checkmarkCircle });
    this.categories$ = this.categoryService.getCategories();
  }

  onSubmit() {
    if (this.addTaskForm.valid) {
      // Obtén el userId del servicio de autenticación
      this.authService.user$.pipe(
        take(1), // Tomar solo el primer valor emitido (el usuario actual)
        switchMap(user => {
          if (!user) {
            throw new Error('Usuario no autenticado');
          }
          const newTask: Task = {
            id: '', // Aunque firestore la genera, la necesitamos para el tipado
            ...this.addTaskForm.value,
            completed: false,
            userId: user.uid // Añade el userId a la tarea
          } as Task;

          return this.taskService.addTask(newTask);
        })
      ).subscribe({
        next: () => {
          this.modalController.dismiss();
        },
        error: (error) => {
          // Manejar el error, por ejemplo, mostrar un mensaje al usuario
          console.error('Error al agregar la tarea:', error);
        }
      });
    }
  }
}