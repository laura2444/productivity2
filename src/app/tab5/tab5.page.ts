import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkboxOutline, flameOutline, heart, star, batteryCharging, calendarOutline, checkmarkCircle, ellipseOutline, trophy, nutritionOutline, gameControllerOutline, colorPaletteOutline, flame } from 'ionicons/icons';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonCol, IonRow, IonGrid, IonBackButton, IonButtons, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class Tab5Page implements OnInit {

  constructor() { addIcons({flameOutline,flame,heart,star,batteryCharging,calendarOutline,checkmarkCircle,ellipseOutline,trophy,nutritionOutline,gameControllerOutline,colorPaletteOutline,checkboxOutline}); }

  ngOnInit() {
  }

}
