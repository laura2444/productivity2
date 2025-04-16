import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  arrowBack, checkmark, createOutline, documentTextOutline, 
  calendarOutline, timeOutline, pricetagsOutline, pricetagOutline, 
  flagOutline, close, attach, checkmarkCircle 
} from 'ionicons/icons';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, 
  IonLabel, IonDatetime, IonSelect, IonSelectOption, IonTextarea, IonList, 
  IonIcon, IonButtons, IonCard, IonCardContent, IonModal, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-task',
  templateUrl: 'add-task.page.html',
  styleUrls: ['add-task.page.scss'],
  standalone: true,
  imports: [IonText, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, 
    IonLabel, IonDatetime, IonSelect, IonSelectOption, IonTextarea, 
    IonIcon, IonButtons, IonCard, IonCardContent, IonModal,
    CommonModule, FormsModule
  ],
  providers: [DatePipe]
})
export class AddTaskPage {
  newTask = {
    id: Date.now(),
    title: '',
    date: '',
    time: '',
    label: 'Trabajo',
    priority: 'Baja',
    description: '',
    state: 'Sin empezar',
    completed: false
  };

  showDatePicker = false;
  showTimePicker = false;

  constructor(
    private taskService: TaskService, 
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController,
    private datePipe: DatePipe
  ) {
    addIcons({
      arrowBack, checkmark, createOutline, documentTextOutline,
      calendarOutline, timeOutline, pricetagsOutline, pricetagOutline,
      flagOutline, close, attach, checkmarkCircle
    });
  }

  // Abrir selectores
  openDatePicker() {
    this.showDatePicker = true;
  }

  openTimePicker() {
    this.showTimePicker = true;
  }

  // Manejar selecciones
  dateSelected(event: any) {
    this.showDatePicker = false;
    if (event.detail.value) {
      this.newTask.date = event.detail.value;
    }
  }

  timeSelected(event: any) {
    this.showTimePicker = false;
    if (event.detail.value) {
      const time = new Date(event.detail.value);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      this.newTask.time = `${hours}:${minutes}`;
    }
  }

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

    try {
      await this.taskService.addTask(this.newTask);
      this.showConfirmation(this.newTask.title);
    } catch (error) {
      this.showError('Error al crear la tarea. Por favor, inténtalo de nuevo.');
    }
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
}