import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

interface Task {
  id: number;
  title: string;
  description?: string;
  date?: string;         // 👈 Añadido
  time?: string;         // 👈 Añadido
  completed: boolean;
  tags?: string[];
  subtasks?: Subtask[];
}

interface Subtask {
  id: number;
  title: string;
  duration?: string;
  status?: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks$.asObservable();
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    this._storage = await this.storage.create();
    const savedTasks = await this._storage.get('tasks') || [];
    this._tasks$.next(savedTasks);
  }

  async addTask(task: Task) {
    const currentTasks = this._tasks$.getValue();
    const updatedTasks = [...currentTasks, { ...task, subtasks: task.subtasks || [] }];
    this._tasks$.next(updatedTasks);
    await this._storage?.set('tasks', updatedTasks);
  }

  async removeTask(id: number) {
    const updatedTasks = this._tasks$.getValue().filter(task => task.id !== id);
    this._tasks$.next(updatedTasks);
    await this._storage?.set('tasks', updatedTasks);
  }

  async toggleTask(id: number) {
    const updatedTasks = this._tasks$.getValue().map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this._tasks$.next(updatedTasks);
    await this._storage?.set('tasks', updatedTasks);
  }

  // Versión corregida que acepta tanto Task como parámetro único
  async updateTask(task: Task) {
    const tasks = this._tasks$.getValue();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = { ...task };
      this._tasks$.next(tasks);
      await this._storage?.set('tasks', tasks);
    }
  }

  // Versión alternativa si prefieres mantener id y task separados
  async updateTaskById(id: number, updatedTask: Partial<Task>) {
    const tasks = this._tasks$.getValue();
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      this._tasks$.next(tasks);
      await this._storage?.set('tasks', tasks);
    }
  }

  async addSubtasks(taskId: number, subtasks: Subtask[]) {
    const tasks = this._tasks$.getValue();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index].subtasks = [...(tasks[index].subtasks || []), ...subtasks];
      this._tasks$.next(tasks);
      await this._storage?.set('tasks', tasks);
    }
  }

  getSubtasks(taskId: number): Subtask[] {
    const tasks = this._tasks$.getValue();
    const task = tasks.find(task => task.id === taskId);
    return task ? task.subtasks || [] : [];
  }

  async deleteTask(id: number) {
    const updatedTasks = this._tasks$.getValue().filter(task => task.id !== id);
    this._tasks$.next(updatedTasks);
    await this._storage?.set('tasks', updatedTasks);
  }

  async loadTasks() {
    const savedTasks = await this._storage?.get('tasks') || [];
    this._tasks$.next(savedTasks);
    return savedTasks;
  }

  private async saveToStorage() {
    await this._storage?.set('tasks', this._tasks$.getValue());
  }

  private async loadFromStorage() {
    const savedTasks = await this._storage?.get('tasks') || [];
    this._tasks$.next(savedTasks);
  }

  
}