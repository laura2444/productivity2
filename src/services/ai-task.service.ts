import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiTaskService {
  private backendUrl = 'https://productivityback.onrender.com/api/generate-subtasks';
  
  constructor(private http: HttpClient) {}

  generateSubtasks(task: any, count: number = 3): Observable<any[]> {
    if (!task || !task.title) {
      console.error('Se requiere título de tarea para generar subtareas');
      return throwError(() => new Error('Datos de tarea incompletos'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      task: {
        title: task.title,
        description: task.description || ''
      },
      count: count
    };

    console.log("Enviando solicitud al backend:", body);

    return this.http.post<any>(`${this.backendUrl}/generate-subtasks`, body, { headers }).pipe(
      timeout(60000), // 60 segundos para cold start de Render
      tap(response => console.log("Respuesta del backend:", response)),
      map((response: any) => {
        if (!response.success || !response.subtasks) {
          throw new Error('Respuesta inválida del servidor');
        }
        
        console.log("Subtareas recibidas:", response.subtasks);
        
        if (response.fallback) {
          console.warn('Usando subtareas por defecto:', response.message);
        }
        
        return response.subtasks;
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Error en solicitud al backend:', error);
        
        if (error instanceof HttpErrorResponse) {
          console.error('Detalles del error HTTP:', error.status, error.statusText);
          if (error.error) {
            console.error('Mensaje de error específico:', JSON.stringify(error.error));
          }
        }
        
        const defaultSubtasks = this.generateDefaultSubtasks(task, count);
        console.log("Retornando subtareas por defecto (error de conexión):", defaultSubtasks);
        return of(defaultSubtasks);
      })
    );
  }

  private generateDefaultSubtasks(task: any, count: number): any[] {
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