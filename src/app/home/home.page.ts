import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

  IonSelect,
  IonSelectOption,
  IonCheckbox } from '@ionic/angular/standalone';
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
import { Observable, Subscription, combineLatest, of, from } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AddTaskPage } from '../modules/home/pages/add-task/add-task.page'; 
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { EditTaskPage } from '../modules/home/pages/edit-task/edit-task.page'; 
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { map, take, switchMap } from 'rxjs/operators';
import { RemoteConfigService } from '../services/remote-config.service';
import { getDocs, limit, orderBy, startAfter } from 'firebase/firestore';

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
    IonCheckbox,

  ],
})
export class HomePage implements OnDestroy, OnInit {
  tasks$!: Observable<Task[]>;
  categories$: Observable<Category[]>;
  selectedCategoryId: string | null = null;
  isNewFeatureEnabled: boolean = false;

  private taskService = inject(TaskService);
  private firestore: Firestore = inject(Firestore);
  private modalController = inject(ModalController);
  private authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private remoteConfigService = inject(RemoteConfigService);

  private authSubscription: Subscription;
  private featureFlagSubscription: Subscription = new Subscription();

  currentPage = 0; // Página actual
  itemsPerPage = 5; // Cantidad de tareas por página
  lastVisible: any; // Último documento visible en la página actual
  isLoading = false;
  noMoreTasks = false;

  constructor() {
    this.categories$ = this.categoryService.getCategories();
    this.authSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.loadTasks(user.uid);
      } else {
        this.tasks$ = of([]);
        this.router.navigate(['/login']);
      }
    });
  }

  async ngOnInit() {
    await this.remoteConfigService.initialize(); // Inicializa Remote Config
    this.featureFlagSubscription = this.remoteConfigService
      .isFeatureEnabled('feature_flag_new_feature', false)
      .subscribe((isEnabled) => {
        this.isNewFeatureEnabled = isEnabled;
        console.log('Feature flag:', this.isNewFeatureEnabled);
      });
  }

  private loadTasks(userId: string) {
    if (this.isLoading || this.noMoreTasks) return;
    this.isLoading = true;

    const userTasksCollection = collection(this.firestore, `users/${userId}/tasks`);
    let tasksQuery = query(userTasksCollection, orderBy("title"), limit(this.itemsPerPage)); // Ordena por 'title' y limita la cantidad de tareas

    if (this.selectedCategoryId) {
      tasksQuery = query(
        tasksQuery,
        where('categoryId', '==', this.selectedCategoryId)
      );
    }

    if (this.lastVisible) {
      tasksQuery = query(tasksQuery, startAfter(this.lastVisible));
    }

    getDocs(tasksQuery)
      .then((querySnapshot) => {
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          // Aquí te aseguras de que el objeto task tiene el ID
          tasks.push({ id: doc.id, ...doc.data() } as Task);
        });

        if (tasks.length < this.itemsPerPage) {
          this.noMoreTasks = true;
        }

        this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        this.tasks$ = of(tasks);
      })
      .catch((error) => {
        console.error('Error al cargar tareas:', error);
      })
      .finally(() => (this.isLoading = false));
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
    this.authService.user$
      .pipe(take(1))
      .subscribe(async (user) => {
        if (!user) return;
        const taskDocRef = doc(this.firestore, `users/${user.uid}/tasks/${id}`);
        await deleteDoc(taskDocRef);
      });
  }

  navigateToAddCategory() {
    this.router.navigate(['/categories']);
  }

  async logout() {
    try {
        await this.authService.logout();
        this.router.navigate(['/login']);
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
  }

  onCategoryChange() {
    this.currentPage = 0;
    this.lastVisible = null;
    this.noMoreTasks = false;
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.loadTasks(user.uid);
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
  nextPage() {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
          if (!this.lastVisible) return;
          this.currentPage++;
          this.loadTasks(user.uid);
      }
    });
  }
  
  previousPage() {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
        if (user) {
            if (this.currentPage === 0) return;
            this.currentPage--;
            this.noMoreTasks = false;
            this.lastVisible = null;
            this.loadTasks(user.uid);
        }
      });
    }
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.featureFlagSubscription.unsubscribe();
  }
}