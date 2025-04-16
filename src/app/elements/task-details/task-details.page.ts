import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, 
  IonLabel, IonDatetime, IonSelect, IonSelectOption, IonTextarea, IonList, 
  IonIcon, IonButtons, IonCard, IonCardContent, IonPopover, IonCheckbox, 
  IonCardSubtitle, IonChip, IonCardHeader, IonCardTitle, IonText, IonSegmentButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, saveOutline, trashOutline, createOutline, calendarOutline, 
  timeOutline, pricetagOutline, documentTextOutline, checkmarkDoneOutline, 
  documentAttachOutline, downloadOutline, pricetagsOutline, flagOutline, add, 
  checkmark, ellipsisVertical } from 'ionicons/icons';

@Component({
  selector: 'app-task-details',
  templateUrl: 'task-details.page.html',
  styleUrls: ['task-details.page.scss'],
  standalone: true,
  imports: [IonModal, IonSegmentButton, IonText, 
    IonCardTitle, IonCardHeader, IonChip, IonCardSubtitle, 
    IonPopover, IonCard, IonCardContent, IonButtons, IonIcon, IonList, 
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonInput, IonButton, IonItem, IonLabel, IonDatetime, 
    IonSelect, IonSelectOption, IonTextarea, IonCheckbox
  ]
})
export class TaskDetailsPage implements OnInit {
getFileIcon(arg0: any) {
throw new Error('Method not implemented.');
}
  @Input() task: any;
  formattedDate: string = '';
  formattedTime: string = '';
  attachment1Checked: boolean = false;
  attachment2Checked: boolean = true; // Ejemplo de adjunto marcado
attachments: any;

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private datePipe: DatePipe
  ) { 
    addIcons({arrowBack,checkmark,createOutline,documentTextOutline,calendarOutline,timeOutline,pricetagsOutline,pricetagOutline,flagOutline,checkmarkDoneOutline,documentAttachOutline,ellipsisVertical,add,trashOutline,saveOutline,downloadOutline});
  }

  ngOnInit() {
    this.updateFormattedDate();
    this.updateFormattedTime();
  }

  async updateTask() {
    if (!this.task.title?.trim()) {
      return this.showError('El título de la tarea es obligatorio.');
    }
    if (!this.task.date) {
      return this.showError('Debes seleccionar una fecha.');
    }
    if (!this.task.time) {
      return this.showError('Debes seleccionar una hora.');
    }

    try {
      await this.taskService.updateTask(this.task);
      this.showConfirmation('Tarea actualizada correctamente.');
    } catch (error) {
      this.showError('Error al actualizar la tarea. Por favor, inténtalo de nuevo.');
    }
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
      this.formattedDate = this.datePipe.transform(this.task.date, 'dd/MM/yyyy') || '';
    }
  }

  updateFormattedTime() {
    if (this.task.time) {
      this.formattedTime = this.formatTime(this.task.time);
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    
    // Si ya está en formato HH:mm
    if (/^\d{1,2}:\d{2}$/.test(time)) {
      return time;
    }
    
    // Si tiene formato de hora con AM/PM
    const timeParts = time.match(/(\d+):(\d+)\s?(AM|PM)?/i); 
    if (!timeParts) return time;

    let hours = parseInt(timeParts[1], 10);
    const minutes = timeParts[2];
    const ampm = timeParts[3]?.toUpperCase() || '';

    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  async confirmDeleteTask() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
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
    try {
      await this.taskService.removeTask(this.task.id);
      this.modalCtrl.dismiss({ deleted: true });
    } catch (error) {
      this.showError('Error al eliminar la tarea. Por favor, inténtalo de nuevo.');
    }
  }
}