import { Injectable } from '@angular/core';
import { Observable, from, of, timeout, catchError } from 'rxjs';

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
    console.log("📤 Enviando solicitud POST");
    console.log("🔗 URL completa:", fullUrl);
    console.log("📦 Body:", JSON.stringify(body));

    // Convertir la promesa de fetch en Observable
    const fetchPromise = fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
      mode: 'cors' // Asegurar que CORS esté habilitado
    })
    .then(response => {
      console.log("📡 Respuesta recibida - Status:", response.status);
      console.log("📡 Headers:", response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("✅ Datos parseados:", data);
      
      if (data.success && data.subtasks && Array.isArray(data.subtasks)) {
        console.log("🎉 Subtareas generadas correctamente:", data.subtasks.length);
        return data.subtasks;
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    })
    .catch(error => {
      console.error('❌ Error en fetch:', error);
      console.error('❌ Error completo:', error.message, error.stack);
      throw error; // Propagar el error para que catchError lo maneje
    });

    // Convertir Promise a Observable con timeout
    return from(fetchPromise).pipe(
      timeout(60000), // 60 segundos
      catchError(error => {
        console.error('❌ Error capturado en pipe:', error);
        console.log('📝 Usando subtareas por defecto');
        return of(this.generateDefaultSubtasks(task, count));
      })
    );
  }

  private generateDefaultSubtasks(task: any, count: number): any[] {
    console.log('🔨 Generando subtareas por defecto para:', task.title);
    
    return Array.from({ length: count }, (_, i) => {
      let subtaskTitle = '';
      let subtaskDescription = '';
      
      const taskTitle = task.title.toLowerCase();
      
      if (taskTitle.includes('examen') || taskTitle.includes('estudiar')) {
        switch (i) {
          case 0:
            subtaskTitle = "Revisar material de estudio";
            subtaskDescription = "Organizar y revisar todos los apuntes, libros y recursos disponibles para el examen.";
            break;
          case 1:
            subtaskTitle = "Hacer ejercicios de práctica";
            subtaskDescription = "Resolver problemas y ejercicios similares a los que podrían aparecer en el examen.";
            break;
          case 2:
            subtaskTitle = "Repasar temas clave";
            subtaskDescription = "Identificar y repasar los conceptos más importantes y difíciles del temario.";
            break;
          default:
            subtaskTitle = `${task.title} - Sesión ${i + 1}`;
            subtaskDescription = `Sesión de estudio ${i + 1} para preparar el examen.`;
        }
      } else if (taskTitle.includes('app')) {
        switch (i) {
          case 0:
            subtaskTitle = "Diseñar la interfaz de usuario";
            subtaskDescription = "Crear wireframes y prototipos de las pantallas principales.";
            break;
          case 1:
            subtaskTitle = "Configurar proyecto";
            subtaskDescription = "Instalar dependencias y configurar la estructura del proyecto.";
            break;
          case 2:
            subtaskTitle = "Implementar modelo de datos";
            subtaskDescription = "Diseñar e implementar las interfaces y servicios necesarios.";
            break;
          default:
            subtaskTitle = `${task.title} - Fase ${i + 1}`;
            subtaskDescription = `Trabajar en la fase ${i + 1} del desarrollo.`;
        }
      } else {
        subtaskTitle = `${task.title} - Parte ${i + 1}`;
        subtaskDescription = `Completar la parte ${i + 1} de la tarea "${task.title}".`;
      }
      
      return {
        id: Date.now() + i + Math.random() * 100, // Más aleatorio
        title: subtaskTitle,
        description: subtaskDescription,
        duration: ['30 min', '45 min', '60 min', '90 min'][Math.floor(Math.random() * 4)],
        status: 'Pendiente',
        completed: false
      };
    });
  }
}