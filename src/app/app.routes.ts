import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },  {
    path: 'tab5',
    loadComponent: () => import('./tab5/tab5.page').then( m => m.Tab5Page)
  },
  {
    path: 'add-task',
    loadComponent: () => import('./add-task/add-task.page').then( m => m.AddTaskPage)
  },
  {
    path: 'task-details',
    loadComponent: () => import('./task-details/task-details.page').then( m => m.TaskDetailsPage)
  },

];
