import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CommonModule } from '@angular/common';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, ToastController, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { EditPostComponent } from 'src/app/modal/edit-post/edit-post.component';
import { Subscription } from 'rxjs';

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
  topicId: string | null = "";
  sub!: Subscription;

  constructor(private route: ActivatedRoute, private topicService: TopicService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.topicId = this.route.snapshot.paramMap.get('topicId');
    const postId: string | null = this.route.snapshot.paramMap.get('postId'); 
    if(this.topicId && postId){   
      this.sub = this.topicService.getPost(this.topicId, postId).subscribe((post: Post) => {
          this.post = post;
      })
    }
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
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
      this.topicService.updatePost(this.topicId!, this.post);
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      color: 'success',
      message: 'Post édité !',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

}
