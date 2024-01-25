import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, IonButtons, IonInput, IonModal } from '@ionic/angular/standalone';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic';
import { NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, RouterLink } from '@angular/router';

addIcons({"trash":trash})

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, IonButtons, IonInput, IonModal],
})
export class TopicComponent implements OnInit{

  @ViewChild(IonModal) modal: IonModal | undefined;

  topic: Topic = {
    id: "-1",
    name: "Default Topic",
    posts: []
  };

  newPostName: string = "";
  newPostDesc: string = "";

  constructor(private topicService: TopicService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const topicId: string | null = this.route.snapshot.paramMap.get('id');
    if(topicId){      
      const topic: Topic | undefined = this.topicService.get(topicId);
      if(topic){
        this.topic = topic;        
      } 
    }
  }

  removePost(postId: string) : void {
    this.topic.posts = this.topic.posts.filter(post => post.id !== postId);
  }

  cancelModal() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirmModal() {
    this.modal?.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.topicService.newPost(this.topic.id, this.newPostName, this.newPostDesc);
    }
    this.newPostName = "";
    this.newPostDesc = "";
  }

}
