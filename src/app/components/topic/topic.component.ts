import { Component, OnInit} from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton, ToastController} from '@ionic/angular/standalone';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addOutline, trash } from 'ionicons/icons';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewPostComponent } from 'src/app/modal/new-post/new-post.component';
import { ModalController } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';

addIcons({"trash":trash, "plus":addOutline})

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOption, IonItemOptions, IonIcon, IonButton],
})
export class TopicComponent implements OnInit{

  topic!: Topic;
  posts$!:Observable<Post[]> ;
  sub!: Subscription;

  constructor(private topicService: TopicService, private route: ActivatedRoute, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit(): void {
    const topicId: string | null = this.route.snapshot.paramMap.get('id');
    if(topicId){      
      this.sub = this.topicService.getTopic(topicId).subscribe((topic: Topic) => this.topic = topic);
      this.posts$ = this.topicService.getPosts(topicId);
    }
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  removePost(postId: string) : void {
    this.topicService.removePost(postId, this.topic.id);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewPostComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.topicService.addPost({id: "-1", name: data.name, description: data.description}, this.topic.id);
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
