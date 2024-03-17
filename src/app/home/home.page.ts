import { Component } from '@angular/core';
import { IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, ToastController } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { AsyncPipe, CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash, addOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { NewTopicComponent } from '../modal/new-topic/new-topic.component';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EditOptionsComponent } from '../modal/edit-options/edit-options.component';

addIcons({"trash":trash, "plus":addOutline, "logout":logOutOutline, "settings":settingsOutline})

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, CommonModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, AsyncPipe],
})
export class HomePage {

  newTopicName: string = "";
  topics$: Observable<Topic[]> = this.topicService.getTopics();

  constructor(private toastCtrl: ToastController, private topicService: TopicService, private modalCtrl: ModalController, private authService: AuthService, private router: Router) {}

  removeTopic(topic: Topic): void{
    this.topicService.removeTopic(topic);
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigateByUrl("/login");
  }

  async editOptions(topic: Topic) {
    const user = this.authService.isConnected();
    if(user && user.email == topic.owner){
      this.topicService.getTopic(topic.id)
      const modal = await this.modalCtrl.create({
        component: EditOptionsComponent,
        componentProps: {
          topic: topic
        }
      });
      modal.present();
    } else {
      this.presentToast('danger', "You don't have the permissions to do that");
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewTopicComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.topicService.addTopic(data);
    }
  }

  private async presentToast(color: 'success' | 'danger', message: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

}
