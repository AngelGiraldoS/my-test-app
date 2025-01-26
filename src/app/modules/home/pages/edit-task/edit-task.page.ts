import { Component, Input, OnInit, inject } from '@angular/core';
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
import { Task } from 'src/app/models/task.model'; 
import { Category } from 'src/app/models/category.model'; 
import { CategoryService } from 'src/app/services/category.service'; 
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
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
export class EditTaskPage implements OnInit {
  @Input() task!: Task; // Usar !
  categories$!: Observable<Category[]>;

  private taskService = inject(TaskService);
  private modalController = inject(ModalController);
  private categoryService = inject(CategoryService);

  editTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    categoryId: new FormControl('', [Validators.required]),
  });

  constructor() {
    addIcons({ checkmarkCircle });
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
    if (this.task) {
      this.editTaskForm.patchValue(this.task);
    }
  }

  onSubmit() {
   if (this.editTaskForm.valid && this.task) {
     const updatedTask: Task = {
       id: this.task.id, // Mantener el ID original
       title: this.editTaskForm.value.title ?? '', // Usar el valor del formulario o una cadena vacía si es null
       description: this.editTaskForm.value.description ?? '', // Usar el valor del formulario o una cadena vacía si es null
       categoryId: this.editTaskForm.value.categoryId ?? '', // Usar el valor del formulario o una cadena vacía si es null
       completed: this.task.completed, // Mantener el estado completado original
       userId: this.task.userId, // Mantener el ID de usuario original
     };
     this.taskService.updateTask(updatedTask).subscribe(() => {
       this.modalController.dismiss();
     });
   }
 }
}
