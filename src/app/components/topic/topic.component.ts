import { Component, OnInit} from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, ToastController} from '@ionic/angular/standalone';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic';
import { NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { addOutline, trash } from 'ionicons/icons';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewPostComponent } from 'src/app/modal/new-post/new-post.component';
import { ModalController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

addIcons({"trash":trash, "plus":addOutline})

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  standalone: true,
  imports: [NgFor, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton],
})
export class TopicComponent implements OnInit{

  topic: Topic = {
    id: "-1",
    name: "Default Topic",
    posts: []
  };

  sub!: Subscription;

  constructor(private topicService: TopicService, private route: ActivatedRoute, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit(): void {
    const topicId: string | null = this.route.snapshot.paramMap.get('id');
    if(topicId){      
      this.sub = this.topicService.get(topicId).subscribe(topic => this.topic = topic);
    }
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  removePost(postId: string) : void {
    this.topic.posts = this.topic.posts.filter(post => post.id !== postId);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewPostComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.topicService.newPost(this.topic.id, data.name, data.description)
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      color: 'success',
      message: 'Post créé !',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

}
