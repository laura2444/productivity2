import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { timeout, catchError, tap } from 'rxjs/operators';

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
    console.log('🎯 generateSubtasks llamado');
    console.log('📋 Task:', task);
    console.log('🔢 Count:', count);
    
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
    console.log("📤 Preparando solicitud POST");
    console.log("🔗 URL completa:", fullUrl);
    console.log("📦 Body a enviar:", JSON.stringify(body, null, 2));

    // Crear la promesa del fetch
    const fetchPromise = async () => {
      console.log("🚀 EJECUTANDO FETCH AHORA...");
      
      try {
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body),
          mode: 'cors',
          credentials: 'omit'
        });

        console.log("📡 Respuesta recibida!");
        console.log("📊 Status:", response.status);
        console.log("📊 StatusText:", response.statusText);
        console.log("📊 OK:", response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error del servidor:", errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Datos parseados correctamente:", data);
        
        if (data.success && data.subtasks && Array.isArray(data.subtasks)) {
          console.log("🎉 Subtareas válidas recibidas:", data.subtasks.length);
          return data.subtasks;
        } else {
          console.error("❌ Formato de respuesta inválido:", data);
          throw new Error('Respuesta inválida del servidor');
        }
        
      } catch (error: any) {
        console.error('❌ ERROR EN FETCH:');
        console.error('   Mensaje:', error.message);
        console.error('   Tipo:', error.name);
        console.error('   Stack:', error.stack);
        throw error;
      }
    };

    // Convertir la promesa a Observable
    console.log("🔄 Convirtiendo fetch a Observable...");
    return from(fetchPromise()).pipe(
      tap(() => console.log("✅ Observable iniciado")),
      timeout(60000),
      tap(result => console.log("✅ Observable emitió resultado:", result)),
      catchError(error => {
        console.error('❌ Error capturado en catchError:', error);
        console.log('📝 Generando subtareas por defecto como fallback');
        return of(this.generateDefaultSubtasks(task, count));
      })
    );
  }

  private generateDefaultSubtasks(task: any, count: number): any[] {
    console.log('🔨 Generando subtareas por defecto');
    console.log('📋 Para tarea:', task?.title || 'Sin título');
    console.log('🔢 Cantidad:', count);
    
    return Array.from({ length: count }, (_, i) => {
      let subtaskTitle = '';
      let subtaskDescription = '';
      
      const taskTitle = (task?.title || '').toLowerCase();
      
      if (taskTitle.includes('examen') || taskTitle.includes('estudiar')) {
        const topics = [
          { title: "Revisar material de estudio", desc: "Organizar y revisar todos los apuntes y recursos." },
          { title: "Hacer ejercicios de práctica", desc: "Resolver problemas similares a los del examen." },
          { title: "Repasar temas clave", desc: "Identificar y repasar los conceptos más importantes." }
        ];
        const topic = topics[i] || topics[0];
        subtaskTitle = topic.title;
        subtaskDescription = topic.desc;
        
      } else if (taskTitle.includes('cancion') || taskTitle.includes('música') || taskTitle.includes('escribir')) {
        const topics = [
          { title: "Escribir la letra", desc: "Crear la letra completa con versos y coro." },
          { title: "Componer la melodía", desc: "Desarrollar la melodía y acordes principales." },
          { title: "Grabar demo", desc: "Hacer una grabación de prueba de la canción." }
        ];
        const topic = topics[i] || topics[0];
        subtaskTitle = topic.title;
        subtaskDescription = topic.desc;
        
      } else if (taskTitle.includes('app')) {
        const topics = [
          { title: "Diseñar interfaz", desc: "Crear wireframes y prototipos de las pantallas." },
          { title: "Configurar proyecto", desc: "Instalar dependencias y configurar estructura." },
          { title: "Implementar modelo de datos", desc: "Diseñar e implementar servicios necesarios." }
        ];
        const topic = topics[i] || topics[0];
        subtaskTitle = topic.title;
        subtaskDescription = topic.desc;
        
      } else {
        subtaskTitle = `${task?.title || 'Tarea'} - Parte ${i + 1}`;
        subtaskDescription = `Completar la parte ${i + 1} de la tarea.`;
      }
      
      const result = {
        id: Date.now() + i + Math.random() * 1000,
        title: subtaskTitle,
        description: subtaskDescription,
        duration: ['30 min', '45 min', '60 min', '90 min'][i % 4],
        status: 'Pendiente',
        completed: false
      };
      
      console.log(`   ✓ Subtarea ${i + 1}:`, result.title);
      return result;
    });
  }
}