import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {close} from 'ionicons/icons';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, 
  IonLabel, IonDatetime, IonSelect, IonSelectOption, IonTextarea, IonList, 
  IonIcon, IonButtons, IonCard, IonCardContent, IonPopover } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-task',
  templateUrl: 'add-task.page.html',
  styleUrls: ['add-task.page.scss'],
  standalone: true,
  imports: [IonPopover, IonCardContent, IonCard, 
    IonButtons, IonIcon, IonList, CommonModule, FormsModule, IonHeader, 
    IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, 
    IonDatetime, IonSelect, IonSelectOption, IonTextarea
  ]
})
export class AddTaskPage {
  newTask = {
    id: Date.now(),
    title: '',
    date: '',
    time: '',
    label: '',
    description: '',
    completed: false
  };

  formattedDate: string = '';
  formattedTime: string = '';

  constructor(
    private taskService: TaskService, 
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController
  ) {addIcons({close}); }

  async addTask() {
    if (!this.newTask.title.trim()) {
      return this.showError('El título de la tarea es obligatorio.');
    }
    if (!this.newTask.date) {
      return this.showError('Debes seleccionar una fecha.');
    }
    if (!this.newTask.time) {
      return this.showError('Debes seleccionar una hora.');
    }

    await this.taskService.addTask(this.newTask);
    this.showConfirmation(this.newTask.title);
  }

  async showConfirmation(taskTitle: string) {
    const alert = await this.alertCtrl.create({
      header: 'Tarea Registrada',
      message: `La tarea "${taskTitle}" ha sido creada con éxito.`,
      buttons: [{
        text: 'OK',
        handler: () => this.closeModal()
      }]
    });
    await alert.present();
  }

  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  updateFormattedDate() {
    this.formattedDate = new Date(this.newTask.date).toLocaleDateString();
  }

  updateFormattedTime() {
    this.formattedTime = new Date(this.newTask.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
