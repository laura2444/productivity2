import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonButton, IonList, IonItem, IonSelect, IonSelectOption, IonIcon, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonCardSubtitle, IonSearchbar, IonFabButton, IonFab } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { TaskService } from 'src/services/task-service.service';
import { NgFor } from '@angular/common';
import { IonThumbnail } from '@ionic/angular/standalone';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonFab, IonFabButton, IonSearchbar, IonCardSubtitle, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonBackButton, IonButton, IonList, IonItem, IonSelect, IonSelectOption, IonIcon, NgFor,IonThumbnail]
})
export class Tab3Page implements OnInit {
  tasks: any[] = [];  
  selectedTask: any = null;
  subtasks: any[] = [];

  constructor(private taskService: TaskService) {
    addIcons({ addCircleOutline });
  }

  async ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  tareaSelect(event: CustomEvent) {
    const taskId = event.detail.value;
    this.selectedTask = this.tasks.find(task => task.id === taskId);
    this.subtasks = this.selectedTask ? this.selectedTask.subtasks || [] : [];
  }

  async subdividirTarea() {
    if (!this.selectedTask) {
      console.log("Selecciona una tarea primero");
      return;
    }

    const newSubtasks = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      title: `Subtarea ${i + 1}`,
      completed: false
    }));

    this.subtasks = [...this.subtasks, ...newSubtasks];

    await this.taskService.addSubtasks(this.selectedTask.id, newSubtasks);
  }

  crearTareaPage() {
    console.log("Redireccionar a la página de creación de tareas");
  }
}
