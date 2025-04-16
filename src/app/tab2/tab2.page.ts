import { Component, OnInit } from '@angular/core';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { 
  IonFab, IonFabButton, IonIcon, IonButton, IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  add, chevronForward, timeOutline, calendarOutline, 
  calendarClearOutline 
} from 'ionicons/icons';
import { TaskService } from 'src/services/task-service.service';
import { AddTaskPage } from '../elements/add-task/add-task.page';
import { TaskDetailsPage } from '../elements/task-details/task-details.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonCheckbox
  ],
  providers: [DatePipe]
})
export class Tab2Page implements OnInit {
  currentDate: Date = new Date();
  todayTasks: any[] = [];
  upcomingTasks: any[] = [];
  weekDays: any[] = [];
  
  pendingTasksCount: number = 0;
  completedTasksToday: number = 0;
  totalTasksCount: number = 0;

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private datePipe: DatePipe
  ) {
    addIcons({ 
      add, 
      chevronForward, 
      timeOutline, 
      calendarOutline,
      calendarClearOutline
    });
  }

  ngOnInit() {
    this.loadData();
    this.generateWeekDays();
  }

  loadData() {
    this.taskService.tasks$.subscribe(tasks => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayStr = this.formatDateForComparison(today);
      
      // Filtrar tareas de hoy
      this.todayTasks = tasks
        .filter(task => this.getTaskDate(task) === todayStr)
        .slice(0, 5); // Mostrar máximo 5 tareas
      
      // Filtrar próximas tareas (tareas futuras, no de hoy)
      this.upcomingTasks = tasks
        .filter(task => {
          const taskDate = this.getTaskDate(task);
          return taskDate > todayStr && !task.completed;
        })
        .sort((a, b) => this.getTaskDate(a).localeCompare(this.getTaskDate(b)))
        .slice(0, 3); // Mostrar máximo 3 tareas
      
      // Contar tareas
      this.totalTasksCount = tasks.length;
      this.pendingTasksCount = tasks.filter(task => !task.completed).length;
      this.completedTasksToday = tasks.filter(task => 
        task.completed && this.getTaskDate(task) === todayStr
      ).length;
      
      // Actualizar datos de la semana
      this.updateWeekDays(tasks);
    });
  }

  generateWeekDays() {
    const today = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Obtener el domingo de la semana actual
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    this.weekDays = [];
    
    // Generar los 7 días de la semana
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      this.weekDays.push({
        date: date.getDate(),
        shortName: dayNames[i],
        fullDate: date,
        isToday: this.isSameDay(date, today),
        completed: false,
        tasksCount: 0
      });
    }
  }

  updateWeekDays(tasks: any[]) {
    // Actualizar el conteo de tareas para cada día
    this.weekDays.forEach(day => {
      const dayStr = this.formatDateForComparison(day.fullDate);
      day.tasksCount = tasks.filter(task => this.getTaskDate(task) === dayStr).length;
      
      // Marcar día como completado si todas las tareas de ese día están completadas
      const dayTasks = tasks.filter(task => this.getTaskDate(task) === dayStr);
      day.completed = dayTasks.length > 0 && dayTasks.every(task => task.completed);
    });
  }

  getTaskDate(task: any): string {
    // Convertir la fecha de la tarea a formato 'yyyy-MM-dd' para comparación
    if (!task.date) return '';
    
    try {
      // Si es una cadena en formato dd/MM/yyyy
      if (typeof task.date === 'string' && task.date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const parts = task.date.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      
      // Si es un objeto Date o un string ISO
      const date = new Date(task.date);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  formatDateForComparison(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  formatDateDay(dateStr: string): string {
    try {
      if (typeof dateStr === 'string' && dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateStr.split('/')[0];
      }
      return new Date(dateStr).getDate().toString();
    } catch {
      return '';
    }
  }

  formatDateMonth(dateStr: string): string {
    try {
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      
      if (typeof dateStr === 'string' && dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const monthIndex = parseInt(dateStr.split('/')[1]) - 1;
        return months[monthIndex];
      }
      
      const date = new Date(dateStr);
      return months[date.getMonth()];
    } catch {
      return '';
    }
  }

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskPage
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'created') {
      this.loadData();
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

  updateTaskStatus(task: any) {
    this.taskService.updateTask(task);
  }

  // Métodos para la barra de progreso de subtareas
  getCompletedSubtasksCount(task: any): number {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return 0;
    }
    return task.subtasks.filter((st: any) => st.completed).length;
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