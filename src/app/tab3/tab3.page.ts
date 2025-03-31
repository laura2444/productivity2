import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
  IonButtons,
  IonButton,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonBackButton,
    IonButton,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonIcon,]
})
export class Tab3Page {
  constructor() {
    addIcons({addCircleOutline})
  }

  tareaSelect(event: CustomEvent){
    // funcion que se activa cuando se selecciona una opcion
    console.log(`Ionic Change fired: ${event.detail.value}`)
  }

  crearTareaPage(){
    // funcion para el redireccionamiento a crear tarea
    console.log("crear tarea")
  }
}
