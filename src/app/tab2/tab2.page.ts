import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';  // ✅ Importar correctamente
import { TaskService } from 'src/services/task-service.service';
import { AddTaskPage } from '../add-task/add-task.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonCheckbox } from '@ionic/angular/standalone';
import { TaskDetailsPage } from '../task-details/task-details.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true, // ✅ Asegurar que es standalone
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonCheckbox
  ],
  providers: [ModalController]  // ✅ Agregar `ModalController` a los providers
})
export class Tab2Page {
  tasks$ = this.taskService.tasks$;

  constructor(private taskService: TaskService, private modalCtrl: ModalController) {}

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskPage
    });
    await modal.present();
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id);
  }

  removeTask(id: number) {
    this.taskService.removeTask(id);
  }
  async openTaskDetails(task: any) {
    const modal = await this.modalCtrl.create({
      component: TaskDetailsPage,
      componentProps: { task }
    });
    await modal.present();
  }
}
