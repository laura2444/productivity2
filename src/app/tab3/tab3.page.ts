import { Component, OnInit } from '@angular/core';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonButton, IonList, IonItem, IonSelect, IonSelectOption, IonIcon, IonCardContent, IonCardTitle, IonCardHeader, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { TaskService } from 'src/services/task-service.service';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonBackButton, IonButton, IonList, IonItem, IonSelect, IonSelectOption, IonIcon, NgFor]
})
export class Tab3Page implements OnInit {
  tasks: any[] = [];  // Lista de tareas cargadas desde Storage
  selectedTask: any = null; // Tarea seleccionada
  subtasks: any[] = []; // Lista de subtareas

  constructor(private taskService: TaskService) {
    addIcons({ addCircleOutline });
  }

  async ngOnInit() {
    // Cargar tareas almacenadas al iniciar la página
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  tareaSelect(event: CustomEvent) {
    // Guardamos la tarea seleccionada
    const taskId = event.detail.value;
    this.selectedTask = this.tasks.find(task => task.id === taskId);
  }

  async subdividirTarea() {
    if (!this.selectedTask) {
      console.log("Selecciona una tarea primero");
      return;
    }

    // Crear 5 subtareas de ejemplo con números del 1 al 5
    const newSubtasks = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,  // ID único
      title: `Subtarea ${i + 1}`,
      completed: false,
      parentId: this.selectedTask.id // Asociamos la subtarea a la tarea principal
    }));

    // Guardamos las subtareas en la lista
    this.subtasks = [...this.subtasks, ...newSubtasks];

    console.log("Subtareas creadas:", this.subtasks);
  }

  crearTareaPage() {
    console.log("Redireccionar a la página de creación de tareas");
  }
}
