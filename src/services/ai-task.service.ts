import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AiTaskService {
  private apiKey = environment.geminiApiKey;
  private model = 'gemini-2.0-flash'; 
  
  constructor(private http: HttpClient) {}

  generateSubtasks(task: any, count: number = 3): Observable<any[]> {
    // Verificar si tenemos los datos necesarios
    if (!task || !task.title) {
      console.error('Se requiere título de tarea para generar subtareas');
      return throwError(() => new Error('Datos de tarea incompletos'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Prompt simplificado para evitar errores de formato
    const prompt = `Genera exactamente ${count} subtareas para la tarea "${task.title}". 
    ${task.description ? `Contexto adicional: ${task.description}` : ''}
    
    Responde únicamente con un array JSON donde cada objeto contiene:
    - title: título breve de la subtarea
    - description: descripción detallada de la subtarea
    - duration: tiempo estimado (formato "XX min")`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
        topK: 40,
        topP: 0.95
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    console.log("Enviando solicitud a Gemini API:", prompt);

    return this.http.post(apiUrl, body, { headers }).pipe(
      timeout(30000),
      tap(response => console.log("Respuesta completa de Gemini:", response)),
      switchMap((response: any) => {
        try {
          if (!response || !response.candidates || !response.candidates[0]?.content?.parts) {
            console.error("Estructura de respuesta inválida:", response);
            return throwError(() => new Error('Estructura de respuesta inválida'));
          }
          
          const text = response.candidates[0]?.content?.parts[0]?.text || '';
          console.log("Texto de respuesta bruto:", text);
          
          // Mejor manejo del texto recibido
          let jsonText = text.trim();
          
          // Intentar extraer solo la parte JSON entre corchetes
          const jsonMatch = jsonText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
          }
          
          console.log("JSON extraído:", jsonText);
          
          try {
            const subtasksData = JSON.parse(jsonText);
            
            if (!Array.isArray(subtasksData)) {
              console.error("La respuesta no es un array:", subtasksData);
              return throwError(() => new Error('La respuesta no es un array'));
            }
            
            const formattedSubtasks = subtasksData.map((item: any, index: number) => ({
              id: Date.now() + index,
              title: item.title || `${task.title} - Subtarea ${index + 1}`,
              description: item.description || `Esta es la subtarea ${index + 1} del proyecto ${task.title}.`,
              duration: item.duration || '30 min',
              status: 'Pendiente',
              completed: false
            }));
            
            console.log("Subtareas formateadas:", formattedSubtasks);
            return of(formattedSubtasks);
          } catch (parseError) {
            console.error('Error al parsear JSON:', parseError, 'Texto:', jsonText);
            return throwError(() => new Error('Error al parsear JSON de la respuesta'));
          }
        } catch (error) {
          console.error('Error al procesar la respuesta:', error);
          return throwError(() => new Error('Error al procesar la respuesta'));
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Error en solicitud a API de IA:', error);
        
        if (error instanceof HttpErrorResponse) {
          console.error('Detalles del error HTTP:', error.status, error.statusText);
          if (error.error) {
            console.error('Mensaje de error específico:', JSON.stringify(error.error));
          }
        }
        
        // Crear mejores subtareas por defecto en caso de error
        const defaultSubtasks = Array.from({ length: count }, (_, i) => {
          let subtaskTitle = '';
          let subtaskDescription = '';
          
          // Generar títulos y descripciones más específicos según el tipo de tarea
          if (task.title.toLowerCase().includes('app')) {
            switch (i) {
              case 0:
                subtaskTitle = "Diseñar la interfaz de usuario";
                subtaskDescription = "Crear wireframes y prototipos de las pantallas principales. Definir el flujo de navegación y la experiencia de usuario para una gestión eficiente de tareas.";
                break;
              case 1:
                subtaskTitle = "Configurar proyecto Ionic";
                subtaskDescription = "Instalar Ionic CLI, crear nuevo proyecto, configurar dependencias y organizar la estructura de carpetas para el desarrollo óptimo de la aplicación.";
                break;
              case 2:
                subtaskTitle = "Implementar modelo de datos";
                subtaskDescription = "Diseñar e implementar las interfaces y servicios para el manejo de tareas, subtareas y su persistencia mediante Ionic Storage o similar.";
                break;
              default:
                subtaskTitle = `${task.title} - Fase ${i + 1}`;
                subtaskDescription = `Trabajar en la fase ${i + 1} del desarrollo de ${task.title}. Esta fase requiere análisis de requisitos y planeación detallada.`;
            }
          } else {
            subtaskTitle = `${task.title} - Componente ${i + 1}`;
            subtaskDescription = `Desarrollar el componente ${i + 1} necesario para completar la tarea "${task.title}". Incluye planificación, implementación y pruebas.`;
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
        
        console.log("Retornando subtareas por defecto:", defaultSubtasks);
        return of(defaultSubtasks);
      })
    );
  }
}