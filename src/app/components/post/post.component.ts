import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { IonCard, IonCardContent, IonCardTitle, IonCardHeader,IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonButton, IonButtons, IonInput, IonModal, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';

addIcons({"edit":createOutline});

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  standalone: true,
  imports: [FormsModule, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonButton, IonButtons, IonInput, IonModal],
})
export class PostComponent  implements OnInit {

  @ViewChild(IonModal) modal: IonModal | undefined;

  post: Post = {
    id: "-1",
    name:"Default Post",
    description: "Default Post description"
  }

  newPostName: string = "";
  newPostDesc: string = "";

  constructor(private route: ActivatedRoute, private topicService: TopicService, private toastCtrl: ToastController) { }

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

  cancelModal() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirmModal() {
    this.modal?.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.post.name = this.newPostName;
      this.post.description = this.newPostDesc;
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
