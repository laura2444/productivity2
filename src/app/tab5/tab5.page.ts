import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkboxOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCol, IonRow, IonGrid, IonBackButton, IonButtons, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class Tab5Page implements OnInit {

  constructor() { addIcons({checkboxOutline}) }

  ngOnInit() {
  }

}
