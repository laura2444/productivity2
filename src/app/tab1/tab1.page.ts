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
      this.tasks = tasks.map(task => ({
        ...task,
        date: this.datePipe.transform(task.date, 'dd/MM/yyyy'),
        time: this.formatTime(task.time),
        searchText: this.createSearchText(task)
      }));
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

  formatTime(time: string): string {
    if (!time) return '';
    const timeParts = time.match(/(\d+):(\d+)\s?(AM|PM)?/); 
    if (!timeParts) return time;
    let hours = parseInt(timeParts[1], 10);
    const minutes = timeParts[2];
    const ampm = timeParts[3] || '';
    if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
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
}
