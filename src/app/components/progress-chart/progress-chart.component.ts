import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ArcElement, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip);

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  tareasCompletadas =8; // 🔹 Cambia este valor para modificar el progreso
  totalTareas = 20;
  progress = 0;
  chart!: Chart;

  ngAfterViewInit() {
    this.calcularProgreso();
    this.createChart();
  }

  calcularProgreso() {
    this.progress = Math.min((this.tareasCompletadas / this.totalTareas) * 100, 100);
  }

  createChart() {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Progreso', 'Restante'],
        datasets: [{
          data: [this.progress, 100 - this.progress],
          backgroundColor: ['blue', '#eee'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false }
        }
      }
    });
  }

  actualizarTareas(nuevasTareas: number) {
    this.tareasCompletadas = nuevasTareas;
    this.calcularProgreso();
    this.updateChart();
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.progress, 100 - this.progress];
      this.chart.update();
    }
  }
}
