import { Component, Input, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Nota } from 'src/app/models/nota.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonButtons,
    FormsModule,
  ],
})
export class ModalPage implements OnInit {
  @Input() nota?: Nota;
  titulo: string = '';
  contenido: string = '';
  private firestore: Firestore = inject(Firestore);
  private modalController = inject(ModalController);

  constructor() {}

  ngOnInit() {
    if (this.nota) {
      this.titulo = this.nota.titulo;
      this.contenido = this.nota.contenido;
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }

  async guardarNota() {
    if (this.nota) {
      // Actualizar nota existente
      const notaDocRef = doc(this.firestore, `notas/${this.nota.id}`);
      await updateDoc(notaDocRef, {
        titulo: this.titulo,
        contenido: this.contenido,
      });
    } else {
      // Agregar nueva nota
      const notasCollection = collection(this.firestore, 'notas');
      await addDoc(notasCollection, {
        titulo: this.titulo,
        contenido: this.contenido,
      });
    }
    this.cerrarModal();
  }
}