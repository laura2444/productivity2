import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons, IonButton, IonList, IonItem, IonSelect, IonSelectOption, IonIcon, 
  IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonCardSubtitle, 
  IonSearchbar, IonFabButton, IonFab, IonInput, IonItemSliding, IonItemOptions,
  IonItemOption, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, createOutline, checkmarkOutline, closeOutline, cutOutline, 
  ellipseOutline, checkmarkCircle, playCircleOutline, timeOutline, layersOutline, 
  listOutline, addCircle, helpCircleOutline, fileTrayOutline, trashOutline,
  checkbox, squareOutline, sparklesOutline } from 'ionicons/icons';
import { TaskService } from 'src/services/task-service.service';
import { AiTaskService } from 'src/services/ai-task.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { IonThumbnail } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true, // Asegurarse de que el componente es standalone
  imports: [
    FormsModule, IonInput, IonFab, IonFabButton, IonSearchbar, IonCardSubtitle, 
    IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButton, 
    IonList, IonItem, IonSelect, IonSelectOption, IonIcon, NgFor, NgIf, NgClass,
    IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption, IonSpinner
  ],
})
export class Tab3Page implements OnInit, OnDestroy {
  tasks: any[] = [];  
  selectedTask: any = null;
  subtasks: any[] = [];
  editingSubtask: any = null;
  isGeneratingSubtasks: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private taskService: TaskService,
    private aiTaskService: AiTaskService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private http: HttpClient

  ) {
    addIcons({ 
      addCircleOutline, createOutline, checkmarkOutline, closeOutline, cutOutline,
      ellipseOutline, checkmarkCircle, playCircleOutline, timeOutline, layersOutline,
      listOutline, addCircle, helpCircleOutline, fileTrayOutline, trashOutline,
      checkbox, squareOutline, sparklesOutline
    });
  }


  async ngOnInit() {
    await this.taskService.loadTasks();
    
    const tasksSub = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      if (this.selectedTask) {
        this.selectedTask = this.tasks.find(task => task.id === this.selectedTask.id);
        this.subtasks = this.selectedTask ? this.selectedTask.subtasks || [] : [];
      }
    });
    
    this.subscriptions.push(tasksSub);
  }

  ngOnDestroy() {
    // Limpiar suscripciones para evitar memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  tareaSelect(event: CustomEvent) {
    const taskId = event.detail.value;
    this.selectedTask = this.tasks.find(task => task.id === taskId);
    this.subtasks = this.selectedTask ? this.selectedTask.subtasks || [] : [];
    // Salir del modo de edición si cambiamos de tarea
    this.editingSubtask = null;
  }

  async subdividirTarea() {
    if (!this.selectedTask) {
      this.showToast("Selecciona una tarea primero");
      return;
    }

    if (this.subtasks.length > 0) {
      const alert = await this.alertController.create({
        header: 'Tarea ya subdividida',
        message: 'Esta tarea ya tiene subtareas. ¿Deseas generar nuevas subtareas con IA?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Regenerar',
            handler: () => {
              this.generateAISubtasks();
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    this.generateAISubtasks();
  }

  async generateAISubtasks() {
    try {
      // 1. PRIMERO obtenemos el número de subtareas
      const numberOfSubtasks = await this.promptForSubtaskCount();
      
      // Si el usuario cancela, salimos sin mostrar el loader
      if (!numberOfSubtasks) {
        return;
      }
      
      // 2. DESPUÉS mostramos el loading
      const loading = await this.loadingController.create({
        message: 'Generando subtareas con IA...',
        spinner: 'crescent'
      });
      await loading.present();
      this.isGeneratingSubtasks = true;
  
      // Usar finalize para asegurar que siempre se complete
      const sub = this.aiTaskService.generateSubtasks(this.selectedTask, numberOfSubtasks)
        .pipe(
          finalize(() => {
            loading.dismiss();
            this.isGeneratingSubtasks = false;
          })
        )
        .subscribe({
          next: async (generatedSubtasks) => {
            console.log("Subtareas recibidas:", generatedSubtasks);
            this.subtasks = generatedSubtasks;
            await this.taskService.addSubtasks(this.selectedTask.id, generatedSubtasks);
            this.showToast('Subtareas generadas con IA exitosamente');
          },
          error: async (error) => {
            console.error('Error en generación de subtareas:', error);
            this.showToast('Error al generar subtareas. Usando plantilla base.');
            
            const defaultSubtasks = Array.from({ length: numberOfSubtasks }, (_, i) => ({
              id: Date.now() + i,
              title: `${this.selectedTask.title} - Parte ${i + 1}`,
              duration: '30 min',
              status: 'Pendiente',
              completed: false
            }));
            
            this.subtasks = defaultSubtasks;
            await this.taskService.addSubtasks(this.selectedTask.id, defaultSubtasks);
          }
        });
      
      this.subscriptions.push(sub);
    } catch (error) {
      console.error("Error general:", error);
      this.isGeneratingSubtasks = false;
      this.showToast('Ocurrió un error al procesar la solicitud');
    }
  }


  async promptForSubtaskCount(): Promise<number | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Número de subtareas',
        message: '¿Cuántas subtareas deseas generar?',
        inputs: [
          {
            name: 'count',
            type: 'number',
            min: 1,
            max: 7,
            value: 3
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(null);
            }
          },
          {
            text: 'Generar',
            handler: (data) => {
              const count = parseInt(data.count);
              resolve(count > 0 && count <= 10 ? count : 3);
            }
          }
        ]
      });
      await alert.present();
    });
  }

  crearTareaPage() {
    console.log("Redireccionar a la página de creación de tareas");
  }

  startSubtask(subtask: any) {
    if (subtask.completed) {
      this.showToast('No puedes iniciar una subtarea completada');
      return;
    }
    
    // Lógica para iniciar la subtarea
    subtask.status = 'En progreso';
    this.updateSubtaskInService(subtask);
    this.showToast('Subtarea iniciada');
  }
  
  editSubtask(subtask: any) {
    // Clonar el objeto para edición
    this.editingSubtask = { ...subtask };
  }
  
  cancelEdit() {
    this.editingSubtask = null;
  }
  
  async saveEdit() {
    if (!this.editingSubtask) return;
    
    // Actualizar la subtarea en el array local
    const index = this.subtasks.findIndex(s => s.id === this.editingSubtask.id);
    if (index !== -1) {
      // Actualizar el estado de completado basado en el estado seleccionado
      if (this.editingSubtask.status === 'Completada') {
        this.editingSubtask.completed = true;
      }
      
      this.subtasks[index] = { ...this.editingSubtask };
      
      // Actualizar en el servicio
      this.updateSubtaskInService(this.editingSubtask);
      
      // Salir del modo de edición
      this.editingSubtask = null;
      this.showToast('Subtarea actualizada correctamente');
    }
  }
  
  async toggleComplete(subtask: any) {
    subtask.completed = !subtask.completed;
    
    // Si se marca como completada, actualizar el estado
    if (subtask.completed) {
      subtask.status = 'Completada';
    } else if (subtask.status === 'Completada') {
      // Si estaba completada, volver a pendiente
      subtask.status = 'Pendiente';
    }
    
    await this.updateSubtaskInService(subtask);
    this.showToast(subtask.completed ? 'Subtarea completada' : 'Subtarea marcada como pendiente');
  }
  
  async deleteSubtask(subtaskId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar esta subtarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Eliminar',
          handler: async () => {
            const updatedSubtasks = this.subtasks.filter(s => s.id !== subtaskId);
            this.subtasks = updatedSubtasks;
            this.selectedTask.subtasks = updatedSubtasks;
            await this.taskService.updateTaskById(this.selectedTask.id, this.selectedTask);
            this.showToast('Subtarea eliminada correctamente');
          }
        }
      ]
    });

    await alert.present();
  }
  
  // Método auxiliar para actualizar una subtarea en el servicio
  private async updateSubtaskInService(updatedSubtask: any) {
    const index = this.subtasks.findIndex(s => s.id === updatedSubtask.id);
    if (index !== -1) {
      this.subtasks[index] = { ...updatedSubtask };
      this.selectedTask.subtasks = this.subtasks;
      await this.taskService.updateTaskById(this.selectedTask.id, this.selectedTask);
    }
  }
  
  // Método para mostrar mensajes toast
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
      cssClass: 'custom-toast'
    });
    toast.present();
  }
}