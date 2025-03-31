import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, 
  IonLabel, IonDatetime, IonSelect, IonSelectOption, IonTextarea, IonList, 
  IonIcon, IonButtons, IonCard, IonCardContent, IonPopover, IonCheckbox 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-details',
  templateUrl: 'task-details.page.html',
  styleUrls: ['task-details.page.scss'],
  standalone: true,
  imports: [
    IonPopover, IonCard, IonCardContent, IonButtons, IonIcon, IonList, 
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonInput, IonButton, IonItem, IonLabel, IonDatetime, 
    IonSelect, IonSelectOption, IonTextarea, IonCheckbox
  ]
})
export class TaskDetailsPage {
  @Input() task: any;
  formattedDate: string = '';
  formattedTime: string = '';

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  
  ngOnInit() {
    this.updateFormattedDate();
    this.updateFormattedTime();
  }

  async updateTask() {
    if (!this.task.title.trim()) {
      return this.showError('El título de la tarea es obligatorio.');
    }
    if (!this.task.date) {
      return this.showError('Debes seleccionar una fecha.');
    }
    if (!this.task.time) {
      return this.showError('Debes seleccionar una hora.');
    }

    await this.taskService.updateTask(this.task);
    this.showConfirmation('Tarea actualizada correctamente.');
  }

  async showConfirmation(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message,
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
    if (this.task.date) {
      this.formattedDate = new Date(this.task.date).toLocaleDateString();
    }
  }

  updateFormattedTime() {
    if (this.task.time) {
      this.formattedTime = new Date(this.task.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
}
