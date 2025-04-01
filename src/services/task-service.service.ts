import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _tasks$ = new BehaviorSubject<any[]>([]);
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

  async addTask(task: { id: number; title: string; completed: boolean; subtasks?: any[] }) {
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

  async updateTask(updatedTask: any) {
    const tasks = this._tasks$.getValue();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...updatedTask };
      this._tasks$.next(tasks);
      await this._storage?.set('tasks', tasks);
    }
  }

  async addSubtasks(taskId: number, subtasks: { id: number; title: string; completed: boolean }[]) {
    const tasks = this._tasks$.getValue();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index].subtasks = [...(tasks[index].subtasks || []), ...subtasks];
      this._tasks$.next(tasks);
      await this._storage?.set('tasks', tasks);
    }
  }


  getSubtasks(taskId: number) {
    const tasks = this._tasks$.getValue();
    const task = tasks.find(task => task.id === taskId);
    return task ? task.subtasks || [] : [];
  }
}
