import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonAlert,
} from '@ionic/angular/standalone';
import { CategoryService } from 'src/app/services/category.service'; 
import { Category } from '../../../../models/category.model';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  trashOutline,
  checkmarkOutline,
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    FormsModule,
    CommonModule,
    IonInput,
    IonAlert
  ],
})
export class CategoriesPage {
  categories$: Observable<Category[]>;
  newCategoryName: string = '';
  editingCategory: Category | null = null;
  editingCategoryName: string = '';
  showAlert = false;
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Guardar',
      handler: (data: any) => {
        if (data.name && this.editingCategory) {
          this.editingCategory.name = data.name;
          this.categoryService.updateCategory(this.editingCategory).subscribe(() => {
            this.categories$ = this.categoryService.getCategories(); // Recargar categorías
            this.editingCategory = null;
          });
        }
      },
    },
  ];

  private categoryService = inject(CategoryService);

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, checkmarkOutline, closeOutline });
    this.categories$ = this.categoryService.getCategories();
  }

  addCategory() {
    if (this.newCategoryName.trim().length > 0) {
      const newCategory: Category = {
        id: '', // Firestore generará el ID
        name: this.newCategoryName,
        userId: '', // Se asignará en el servicio
      };
      this.categoryService.addCategory(newCategory).subscribe(() => {
        this.newCategoryName = ''; // Limpiar el campo
        this.categories$ = this.categoryService.getCategories(); // Recargar categorías
      });
    }
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.showAlert = true;
  }

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.categories$ = this.categoryService.getCategories(); // Recargar categorías
    });
  }
}