import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonInput, IonItemOption, IonItemOptions, IonItemSliding, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonButtons, ModalController, IonList } from '@ionic/angular/standalone';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';

addIcons({"trash":trash})

@Component({
  selector: 'app-edit-options',
  templateUrl: './edit-options.component.html',
  styleUrls: ['./edit-options.component.scss'],
  standalone: true,
  imports: [FormsModule, IonItemOption, IonItemOptions, IonItemSliding, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonButton, IonButtons, IonList, IonInput],
})
export class EditOptionsComponent implements OnInit{

  topic!: Topic
  newReader: string = ""
  newEditor: string = ""

  constructor(private modalCtrl: ModalController, private topicService: TopicService) {}
  ngOnInit(): void {
    this.topicService.getTopic(this.topic.id).subscribe((topic: Topic) => {
      this.topic = topic;
    }) 
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  addNewReader(){
    if(this.newReader != ""){
      this.topicService.addNewReader(this.topic.id, this.newReader);
      this.newReader = ""
    }
  }

  addNewEditor(){
    if(this.newEditor != ""){
      this.topicService.addNewEditor(this.topic.id, this.newEditor);
      this.newEditor = ""
    }  
  }

  deleteReader(name: string){
    this.topicService.deleteReader(this.topic.id, name);
  }

  deleteEditor(name: string){
    this.topicService.deleteEditor(this.topic.id, name);
  }

}
