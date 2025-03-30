import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProgressChartComponent {
  @Input() completed: number = 15;
  @Input() total: number = 20;

  get progress(): number {
    return Math.min(100, Math.round((this.completed / this.total) * 100));
  }

  get strokeDashoffset(): number {
    const circumference = 2 * Math.PI * 45;
    return circumference - (this.progress / 100) * circumference;
  }
}