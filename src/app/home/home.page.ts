import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, ToastController } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash, addOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { NewTopicComponent } from '../modal/new-topic/new-topic.component';
import { Subscription } from 'rxjs';

addIcons({"trash":trash, "plus":addOutline})

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton],
})
export class HomePage {

  newTopicName: string = "";
  topics: Topic[] = [];
  sub!: Subscription;

  constructor(private topicService: TopicService, private modalCtrl: ModalController, private toastCtrl: ToastController) {
    this.sub = this.topicService.getTopics().subscribe((topics: Topic[]) => this.topics = topics);
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  removeTopic(topicId: string): void{
    this.topicService.removeTopic(topicId);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewTopicComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.topicService.addTopic({id: "-1", name: data});
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      color: 'success',
      message: 'Topic créé !',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

}
