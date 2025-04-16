import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonSearchbar, IonFab, IonFabButton, IonIcon, IonThumbnail, IonCardContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { barChartOutline, checkmarkCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ProgressChartComponent } from '../components/progress-chart/progress-chart.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonSearchbar, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonThumbnail, RouterModule, IonCardContent, IonButtons, IonBackButton, ProgressChartComponent]
})
export class Tab4Page implements OnInit {
  weekData = [
    { label: 'L', completed: 3, total: 5 },
    { label: 'M', completed: 4, total: 8 },
    { label: 'Mi', completed: 2, total: 4 },
    { label: 'J', completed: 5, total: 5 },
    { label: 'V', completed: 1, total: 3 },
    { label: 'S', completed: 0, total: 2 },
    { label: 'D', completed: 2, total: 4 }
  ];
  
  getPercentage(completed: number, total: number): number {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  today: Date = new Date();

  constructor() {
    addIcons({barChartOutline,checkmarkCircle});
  }

  ngOnInit() {}

}
