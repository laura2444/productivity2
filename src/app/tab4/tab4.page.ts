import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonSearchbar, IonFab, IonFabButton, IonIcon, IonThumbnail, IonCardContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { barChartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ProgressChartComponent } from '../components/progress-chart/progress-chart.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonSearchbar, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonThumbnail, RouterModule, IonCardContent, IonButtons, IonBackButton, ProgressChartComponent]
})
export class Tab4Page implements OnInit, AfterViewInit {
  @ViewChild(ProgressChartComponent) progressChart!: ProgressChartComponent;
  today: Date = new Date();

  constructor() {
    addIcons({ barChartOutline });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Asegurar que el progreso se actualiza después de que la vista se renderice
    setTimeout(() => {
      this.actualizarProgresoDelUsuario(2); // 🔹 Cambia el número según el progreso deseado
    }, 0);
  }

  actualizarProgresoDelUsuario(tareasCompletadas: number) {
    if (this.progressChart) {
      this.progressChart.actualizarTareas(tareasCompletadas);
    } else {
      console.warn('ProgressChartComponent aún no está disponible.');
    }
  }
}
