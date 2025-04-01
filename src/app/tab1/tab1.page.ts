import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { RouterModule } from '@angular/router';
import {
  IonFab, IonFabButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSearchbar, IonButton, IonCard, IonCardContent, IonCardHeader, 
  IonCardSubtitle, IonCardTitle, IonThumbnail
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { AddTaskPage } from '../elements/add-task/add-task.page';
import { TaskDetailsPage } from '../elements/task-details/task-details.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, NgFor, DatePipe, 
    IonButton, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonSearchbar, IonFab, IonFabButton, IonIcon, RouterModule, 
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, 
    IonThumbnail
  ],
  providers: [ModalController, DatePipe] 
})
export class Tab1Page implements OnInit {
  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private datePipe: DatePipe
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        ...task,
        date: this.datePipe.transform(task.date, 'dd/MM/yyyy'), // ✅ Sigue formateando la fecha
        time: this.formatTime(task.time) // ✅ Nueva función para formatear la hora sin errores
      }));
    });
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
  
  

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskPage
    });
    await modal.present();
  }

  async toggleTaskCompletion(task: any) {
    await this.taskService.toggleTask(task.id);
  }

  async openTaskDetails(task: any) {
    const modal = await this.modalCtrl.create({
      component: TaskDetailsPage,
      componentProps: { task } // Pasar tarea al modal
    });
    await modal.present();
  }
}
