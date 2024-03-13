import { Component } from '@angular/core';
import { IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { AsyncPipe, CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash, addOutline, logOutOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { NewTopicComponent } from '../modal/new-topic/new-topic.component';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth';

addIcons({"trash":trash, "plus":addOutline, "logout":logOutOutline})

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

  constructor(private topicService: TopicService, private modalCtrl: ModalController, private authService: AuthService, private router: Router) {}

  removeTopic(topicId: string): void{
    this.topicService.removeTopic(topicId);
  }

  logout(): void {
    this.authService.signOut().then(res =>  this.router.navigateByUrl("/login"));
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewTopicComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.topicService.addTopic({id: "-1", name: data});
    }
  }

}
