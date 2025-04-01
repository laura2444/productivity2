import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, 
  IonLabel, IonDatetime, IonSelect, IonSelectOption, IonTextarea, IonList, 
  IonIcon, IonButtons, IonCard, IonCardContent, IonPopover, IonCheckbox, IonCardSubtitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, trash } from 'ionicons/icons';

@Component({
  selector: 'app-task-details',
  templateUrl: 'task-details.page.html',
  styleUrls: ['task-details.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, 
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

  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private datePipe: DatePipe
  ) { addIcons({close,trash})}

  
  ngOnInit() {
    this.updateFormattedDate();
    this.updateFormattedTime();
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        ...task,
        date: this.datePipe.transform(task.date, 'dd/MM/yyyy'), // ✅ Sigue formateando la fecha
        time: this.formatTime(task.time) // Nueva función para formatear la hora sin errores
      }));
    });
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

  formatTime(time: string): string {
    if (!time) return ''; // Evita errores si la hora es nula o indefinida
  
    const timeParts = time.match(/(\d+):(\d+)\s?(AM|PM)?/); 
    if (!timeParts) return time; // Si el formato es inválido, devuelve el original
  
    let hours = parseInt(timeParts[1], 10);
    const minutes = timeParts[2];
    const ampm = timeParts[3] || ''; // AM/PM (si está presente)
  
    // Conversión de formato 12h a 24h si es necesario
    if (ampm.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }
  

  async confirmDeleteTask() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteTask()
        }
      ]
    });
    await alert.present();
  }
  
  async deleteTask() {
    await this.taskService.removeTask(this.task.id);
    this.modalCtrl.dismiss(); // Cierra el modal después de eliminar la tarea
  }
  
}
