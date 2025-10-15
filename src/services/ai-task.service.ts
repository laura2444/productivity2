import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiTaskService {
  private backendUrl = 'https://productivityback.onrender.com/api';
  
  constructor() {
    console.log('🔧 AiTaskService inicializado');
    console.log('🔗 Backend URL base:', this.backendUrl);
  }

  generateSubtasks(task: any, count: number = 3): Observable<any[]> {
    if (!task || !task.title) {
      console.error('❌ Se requiere título de tarea');
      return of(this.generateDefaultSubtasks(task, count));
    }

    const body = {
      task: {
        title: task.title,
        description: task.description || ''
      },
      count: count
    };

    const fullUrl = `${this.backendUrl}/generate-subtasks`;
    console.log("📤 Enviando solicitud con FETCH");
    console.log("🔗 URL completa:", fullUrl);
    console.log("📦 Body:", body);

    // Usar fetch nativo en lugar de HttpClient
    return new Observable(observer => {
      const timeoutId = setTimeout(() => {
        console.warn('⏱️ Timeout: Usando subtareas por defecto');
        observer.next(this.generateDefaultSubtasks(task, count));
        observer.complete();
      }, 60000); // 60 segundos timeout

      fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(response => {
        clearTimeout(timeoutId);
        console.log("📡 Respuesta recibida - Status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("✅ Datos parseados:", data);
        
        if (data.success && data.subtasks && Array.isArray(data.subtasks)) {
          console.log("🎉 Subtareas generadas correctamente:", data.subtasks.length);
          observer.next(data.subtasks);
          observer.complete();
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('❌ Error en fetch:', error.message);
        console.log('📝 Usando subtareas por defecto debido al error');
        
        const defaults = this.generateDefaultSubtasks(task, count);
        observer.next(defaults);
        observer.complete();
      });
    });
  }

  private generateDefaultSubtasks(task: any, count: number): any[] {
    console.log('🔨 Generando subtareas por defecto');
    
    return Array.from({ length: count }, (_, i) => {
      let subtaskTitle = '';
      let subtaskDescription = '';
      
      if (task.title.toLowerCase().includes('app')) {
        switch (i) {
          case 0:
            subtaskTitle = "Diseñar la interfaz de usuario";
            subtaskDescription = "Crear wireframes y prototipos de las pantallas principales. Definir el flujo de navegación y la experiencia de usuario.";
            break;
          case 1:
            subtaskTitle = "Configurar proyecto";
            subtaskDescription = "Instalar dependencias, crear estructura de carpetas y configurar el entorno de desarrollo.";
            break;
          case 2:
            subtaskTitle = "Implementar modelo de datos";
            subtaskDescription = "Diseñar e implementar las interfaces y servicios para el manejo de datos.";
            break;
          default:
            subtaskTitle = `${task.title} - Fase ${i + 1}`;
            subtaskDescription = `Trabajar en la fase ${i + 1} del desarrollo de ${task.title}.`;
        }
      } else {
        subtaskTitle = `${task.title} - Componente ${i + 1}`;
        subtaskDescription = `Desarrollar el componente ${i + 1} necesario para completar la tarea "${task.title}".`;
      }
      
      return {
        id: Date.now() + i,
        title: subtaskTitle,
        description: subtaskDescription,
        duration: ['30 min', '45 min', '60 min', '90 min'][Math.floor(Math.random() * 4)],
        status: 'Pendiente',
        completed: false
      };
    });
  }
}