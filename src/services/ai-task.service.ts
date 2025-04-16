import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiTaskService {
  private apiKey = 'AIzaSyABBoS19JdslBti21hcRT3tT7ASrc8EWsE'; 
  private model = 'gemini-2.0-flash'; 
  
  constructor(private http: HttpClient) {}

  generateSubtasks(task: any, count: number = 3): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const prompt = `Crea ${count} subtareas específicas y prácticas para completar la siguiente tarea: "${task.title}".
      ${task.description ? `Descripción adicional: ${task.description}` : ''}

      Cada subtarea debe:
      1. Ser concreta y accionable
      2. Tener una duración estimada realista (en minutos)
      3. Estar en un formato que ayude a completar la tarea principal

      Devuelve solo un array JSON con la siguiente estructura para cada subtarea:
      [
        {
          "title": "Título de la subtarea 1",
          "duration": "XX min"
        },
        ...
      ]`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    return this.http.post(apiUrl, body, { headers }).pipe(
      map((response: any) => {
        try {
          const text = response.candidates[0]?.content?.parts[0]?.text || '';
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const subtasksData = JSON.parse(jsonMatch[0]);
            return subtasksData.map((item: any, index: number) => ({
              id: Date.now() + index,
              title: item.title,
              duration: item.duration || '30 min',
              status: 'Pendiente',
              completed: false
            }));
          }
          throw new Error('No se pudo extraer el JSON de la respuesta');
        } catch (error) {
          console.error('Error al procesar la respuesta de la IA:', error);
          return Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i,
            title: `${task.title} - Parte ${i + 1}`,
            duration: '30 min',
            status: 'Pendiente',
            completed: false
          }));
        }
      }),
      catchError(error => {
        console.error('Error al comunicarse con la API de IA:', error);
        return of(Array.from({ length: count }, (_, i) => ({
          id: Date.now() + i,
          title: `${task.title} - Parte ${i + 1}`,
          duration: '30 min',
          status: 'Pendiente',
          completed: false
        })));
      })
    );
  }
}