import { Component } from '@angular/core';
import { ModalController, IonInput } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonButtons} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-topic',
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss'],
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonButtons, IonInput]
})
export class NewTopicComponent {

  newTopicName: string = "";

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.newTopicName, 'confirm');
  }

}
