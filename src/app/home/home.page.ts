import { Component, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, IonButtons, IonInput, IonModal } from '@ionic/angular/standalone';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { RouterLink } from '@angular/router';

addIcons({"trash":trash})

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, IonButtons, IonInput, IonModal],
})
export class HomePage {

  @ViewChild(IonModal) modal: IonModal | undefined;

  newTopicName: string = "";

  constructor(private topicService: TopicService) {}

  getTopics(): Topic[] {
    return this.topicService.getAll();
  }

  removeTopic(topicId: string): void{
    this.topicService.removeTopic(topicId);
  }

  cancelModal(): void {
    this.modal?.dismiss(null, 'cancel');
  }

  confirmModal(): void {
    this.modal?.dismiss(this.newTopicName, 'confirm');
  }

  onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.topicService.newTopic("" + ev.detail.data);
    }
    this.newTopicName = "";
  }

}
