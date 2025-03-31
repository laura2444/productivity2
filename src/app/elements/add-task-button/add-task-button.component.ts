import { Component, EventEmitter, Output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task-button',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <ion-button expand="full" (click)="onClick()" class="add-task-button">
      <ion-icon name="add-circle-outline"></ion-icon>
      {{ text }}
    </ion-button>
  `,
  styles: [
    `
    .add-task-button {
      background-color: #443673;
      color: white;
      font-weight: bold;
      border-radius: 10px;
    }
    `
  ]
})
export class AddTaskButtonComponent {
  @Output() clickEvent = new EventEmitter<void>();
  text: string = 'Agregar Tarea';

  onClick() {
    this.clickEvent.emit();
  }
}
