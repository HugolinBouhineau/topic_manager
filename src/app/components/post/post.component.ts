import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput, ToastController, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { EditPostComponent } from 'src/app/modal/edit-post/edit-post.component';

addIcons({"edit":createOutline});

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonInput],
})
export class PostComponent {

  post: Post = {
    id: "-1",
    name:"Default Post",
    description: "Default Post description"
  }

  newPostName: string = "";
  newPostDesc: string = "";

  constructor(private route: ActivatedRoute, private topicService: TopicService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    const topicId: string | null = this.route.snapshot.paramMap.get('topicId');
    if(topicId){      
      const topic: Topic | undefined = this.topicService.get(topicId);
      if(topic){   
        const postId: string | null = this.route.snapshot.paramMap.get('postId');
        const post = topic.posts.find(post => post.id === postId);
        if(post){
          this.post = post;
          this.newPostName = post.name;
          this.newPostDesc = post.description;
        }
      } 
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EditPostComponent,
      componentProps: {
        post: this.post
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.post.name = data.name;
      this.post.description = data.description;
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
