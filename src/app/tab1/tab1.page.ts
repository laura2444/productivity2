import { Component } from '@angular/core';
import { IonFab,IonFabButton,IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonButtons, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,IonThumbnail
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,IonSearchbar,IonFab,IonFabButton,IonIcon, IonButtons, RouterModule,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,IonThumbnail],
})
export class Tab1Page {
  constructor() {

    addIcons({ add });
  }
}
