import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.page.html',
  styleUrls: ['./sub-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SubTaskPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
