import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'tab5',
    loadComponent: () => import('./tab5/tab5.page').then( m => m.Tab5Page)
  },
  {
    path: 'add-task',
    loadComponent: () => import('./elements/add-task/add-task.page').then( m => m.AddTaskPage)
  },
  {
    path: 'task-details',
    loadComponent: () => import('./elements/task-details/task-details.page').then( m => m.TaskDetailsPage)
  },
  {
    path: 'sub-task',
    loadComponent: () => import('./elements/sub-task/sub-task.page').then( m => m.SubTaskPage)
  },


];
