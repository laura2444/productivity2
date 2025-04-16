import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { TaskService } from 'src/services/task-service.service';
import { RouterModule } from '@angular/router';
import { 
  IonFab, IonFabButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSearchbar, IonButton, IonCard, IonCardContent, IonCardHeader, 
  IonCardSubtitle, IonCardTitle, IonThumbnail, IonList, IonItem, IonButtons, 
  IonBackButton, IonChip, IonLabel, IonBadge, IonSegmentButton, IonSegment 
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, searchOutline, ellipsisVertical, timeOutline, calendarOutline } from 'ionicons/icons';
import { AddTaskPage } from '../elements/add-task/add-task.page';
import { TaskDetailsPage } from '../elements/task-details/task-details.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonSegment, IonSegmentButton, IonBadge, IonLabel, IonChip, IonBackButton, 
    IonButtons, IonItem, IonList, CommonModule, NgFor, DatePipe, IonButton, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, 
    IonFabButton, IonIcon, RouterModule, IonCard, IonCardContent, IonCardHeader, 
    IonCardSubtitle, IonCardTitle, IonThumbnail, FormsModule
  ],
  providers: [ModalController, ActionSheetController, DatePipe] 
})
export class Tab1Page implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  filterStatus: string = 'all';
  searchTerm: string = '';

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private datePipe: DatePipe
  ) {
    addIcons({ add, searchOutline, ellipsisVertical,timeOutline,calendarOutline });
  }

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks.map(task => {
        const formattedDate = this.formatDate(task.date);
        const formattedTime = this.formatTime(task.time);
        return {
          ...task,
          date: formattedDate,
          time: formattedTime,
          searchText: this.createSearchText({ ...task, date: formattedDate, time: formattedTime })
        };
      });
      this.applyFilters();
    });
  }
  
  private createSearchText(task: any): string {
    return [
      task.title,
      task.description,
      task.tags?.join(' '),
      task.date,
      task.time
    ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  }

  applyFilters() {
    let filtered = [...this.tasks];
    if (this.filterStatus === 'progress') {
      filtered = filtered.filter(task => !task.completed);
    } else if (this.filterStatus === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(task => task.searchText.includes(term));
    }
    this.filteredTasks = filtered;
  }

  private formatDate(date: any): string {
    if (!date) return '';
    
    // Si ya está en formato dd/MM/yyyy no hacemos nada
    if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return date;
    }
  
    // Si es tipo Date o un ISO string
    try {
      return this.datePipe.transform(new Date(date), 'dd/MM/yyyy') || '';
    } catch {
      return '';
    }
  }
  

  formatTime(time: any): string {
    if (!time) return '';
  
    if (typeof time !== 'string') return '';
  
    const is24HourFormat = time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
    if (is24HourFormat) return time;
  
    const parts = time.match(/(\d+):(\d+)\s?(AM|PM)?/i);
    if (!parts) return time;
  
    let hours = parseInt(parts[1], 10);
    const minutes = parts[2];
    const ampm = (parts[3] || '').toUpperCase();
  
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskPage
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'created') {
      this.taskService.loadTasks(); // Asegúrate de tener este método en el servicio
    }
  }

  async openTaskDetails(task: any) {
    const modal = await this.modalCtrl.create({
      component: TaskDetailsPage,
      componentProps: { task }
    });
    await modal.present();
    await modal.onWillDismiss();
  }

  async showTaskOptions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de tarea',
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => this.openTaskDetails(task)
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => this.taskService.deleteTask(task.id)
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  getCompletedSubtasksCount(task: any): number {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return 0;
    }
    return task.subtasks.filter((st: { completed: any; }) => st.completed).length;
  }
  
  getSubtasksCount(task: any): number {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return 0;
    }
    return task.subtasks.length;
  }
  
  getSubtaskCompletionPercentage(task: any): number {
    const total = this.getSubtasksCount(task);
    if (total === 0) return 0;
    return (this.getCompletedSubtasksCount(task) / total) * 100;
  }

  
}
