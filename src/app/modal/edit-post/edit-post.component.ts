import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonButtons, IonInput, ModalController} from '@ionic/angular/standalone';
import { Post } from 'src/app/models/post';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonButtons, IonInput],
})
export class EditPostComponent {

  post: Post = {
    id: "-1",
    name:"Default Post",
    description: "Default Post description"
  }

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.post, 'confirm');
  }

}
