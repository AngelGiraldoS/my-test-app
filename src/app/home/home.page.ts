import { Component, inject, OnDestroy } from '@angular/core';
import {
  ModalController,
  IonMenu,
  IonMenuToggle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { Task } from '../models/task.model';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  where,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, Subscription, combineLatest, of, from } from 'rxjs'; // Importa 'from'
import { CommonModule } from '@angular/common';
import { AddTaskPage } from '../modules/home/pages/add-task/add-task.page'; 
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { EditTaskPage } from '../modules/home/pages/edit-task/edit-task.page'; 
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { map, startWith, take, switchMap } from 'rxjs/operators'; // Importa 'take' y 'switchMap'


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,

    IonMenu,
    IonMenuToggle,
    FormsModule,
    RouterModule,
    IonSelect,
    IonSelectOption,
    IonCheckbox
  ],
})
export class HomePage implements OnDestroy {
  private remoteConfigService = inject(RemoteConfigService);
    private featureFlagSubscription: Subscription;

    isNewFeatureEnabled: boolean = false;

  tasks$!: Observable<Task[]>;
  categories$: Observable<Category[]>;
  selectedCategoryId: string | null = null;
  private taskService = inject(TaskService);
  private firestore: Firestore = inject(Firestore);
  private modalController = inject(ModalController);
  private authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private authSubscription: Subscription;

  constructor() {
    this.categories$ = this.categoryService.getCategories();

    this.authSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        const userTasksCollection = collection(
          this.firestore,
          `users/${user.uid}/tasks`
        );
        const selectedCategory$ = of(this.selectedCategoryId);

        this.tasks$ = combineLatest([
          collectionData(query(userTasksCollection), {
            idField: 'id',
          }) as Observable<Task[]>,
          selectedCategory$
        ]).pipe(
          map(([tasks, selectedCategoryId]) => {
            if (selectedCategoryId) {
              return tasks.filter(
                (task) => task.categoryId === selectedCategoryId
              );
            } else {
              return tasks;
            }
          })
        );
      } else {
        this.tasks$ = of([]);
        this.router.navigate(['/login']);
      }
    });
  }

  async addTask() {
    const modal = await this.modalController.create({
      component: AddTaskPage,
    });
    return await modal.present();
  }

  async editTask(task: Task) {
    const modal = await this.modalController.create({
      component: EditTaskPage,
      componentProps: {
        task: task,
      },
    });
    return await modal.present();
  }

  async deleteTask(id: string) {
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        const taskDocRef = doc(this.firestore, `users/${user.uid}/tasks/${id}`);
        await deleteDoc(taskDocRef);
      }
    });
  }

  navigateToAddCategory() {
    this.router.navigate(['/categories']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  onCategoryChange() {
    this.authSubscription = this.authService.user$.subscribe((user) => {
        if (user) {
          const userTasksCollection = collection(
            this.firestore,
            `users/${user.uid}/tasks`
          );
          const selectedCategory$ = of(this.selectedCategoryId);
  
          this.tasks$ = combineLatest([
            collectionData(query(userTasksCollection), {
              idField: 'id',
            }) as Observable<Task[]>,
            selectedCategory$
          ]).pipe(
            map(([tasks, selectedCategoryId]) => {
              if (selectedCategoryId) {
                return tasks.filter(
                  (task) => task.categoryId === selectedCategoryId
                );
              } else {
                return tasks;
              }
            })
          );
        } else {
          this.tasks$ = of([]);
          this.router.navigate(['/login']);
        }
      });
  }

  async toggleTaskCompletion(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };
    this.authService.user$.pipe(
        take(1),
        switchMap(user => {
          if (!user) {
            throw new Error('Usuario no autenticado');
          }
          const taskDocRef = doc(this.firestore, `users/${user.uid}/tasks/${task.id}`);
          return from(updateDoc(taskDocRef, { completed: updatedTask.completed }));
        })
      ).subscribe({
        error: (error) => {
          console.error('Error al actualizar la tarea:', error);
        }
      });
    }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}