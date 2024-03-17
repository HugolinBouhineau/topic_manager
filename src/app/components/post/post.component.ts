import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CommonModule } from '@angular/common';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { EditPostComponent } from 'src/app/modal/edit-post/edit-post.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

addIcons({"edit":createOutline});

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput],
})
export class PostComponent {

  post!: Post;
  topic!: Topic;
  sub!: Subscription;
  sub2!: Subscription;

  constructor(private route: ActivatedRoute, private topicService: TopicService, private modalCtrl: ModalController, private auth: AuthService) { }

  ngOnInit() {
    const topicId = this.route.snapshot.paramMap.get('topicId');
    const postId: string | null = this.route.snapshot.paramMap.get('postId'); 
    if(topicId && postId){   
      this.sub2 = this.topicService.getTopic(topicId).subscribe((topic: Topic) => this.topic = topic)
      this.sub = this.topicService.getPost(topicId, postId).subscribe((post: Post) => this.post = post)
    }
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  canEditPost(){
    const user = this.auth.isConnected()
    return user && this.topic && (user.email == this.topic.owner || (this.topic.editors as (string | null)[]).includes(user.email))
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EditPostComponent,
      componentProps: {
        post: {
          id: "-1",
          name: this.post.name,
          description: this.post.description
        }
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.post.name = data.name;
      this.post.description = data.description;
      this.topicService.updatePost(this.topic, this.post);
    }
  }
  
}
