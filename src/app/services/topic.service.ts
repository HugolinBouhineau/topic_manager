import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { Observable, map } from 'rxjs';
import { CollectionReference, Firestore, addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, docData, or, query, updateDoc, where } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topicsCollection: CollectionReference;

  constructor(private firestore: Firestore, private toastCtrl: ToastController, private auth: AuthService) {
    this.topicsCollection = collection(this.firestore, 'topics');
   }

  getTopics(): Observable<Topic[]> {
    return collectionData(query(this.topicsCollection,
      or(where('owner', '==', this.auth.isConnected() ? this.auth.isConnected()?.email:""),
      where('readers', "array-contains", this.auth.isConnected() ? this.auth.isConnected()?.email:""),
      where('editors', "array-contains", this.auth.isConnected() ? this.auth.isConnected()?.email:"")))
    , { idField: 'id' }) as Observable<Topic[]>;
  }

  getTopic(topicId: string): Observable<Topic> {
   return docData(doc(this.firestore, 'topics/' + topicId), { idField: 'id' }) as Observable<Topic>;
  }

  getPosts(topicId: string): Observable<Post[]> {
    return collectionData(collection(this.firestore, "topics/" + topicId + "/posts"), { idField: 'id' }) as Observable<Post[]>;
  }

  getPost(topicId: string, postId: string): Observable<Post> {
    return docData(doc(this.firestore, 'topics/' + topicId + "/posts/" + postId), { idField: 'id' }) as Observable<Post>;
  }
  
  addTopic(topicName: string): void {
    addDoc(this.topicsCollection, { name: topicName, owner: this.auth.isConnected() ? this.auth.isConnected()?.email:"", readers: [], editors:[] });
    this.presentToast('success', 'Topic successfully created');
  }

  removeTopic(topic: Topic): void {
    const user = this.auth.isConnected();
    if(user && user.email == topic.owner){
      const sub = this.getPosts(topic.id).forEach((posts: Post[]) => {
        posts.forEach((post: Post) => this.removePost(post.id, topic))
      });
      deleteDoc(doc(this.firestore, "topics", topic.id));
      this.presentToast('success', 'Topic successfully deleted');
    }else{
      this.presentToast('danger', "You don't have the permissions to do that");
    }
  }

  addPost(post: Post, topic: Topic): void {
    const user = this.auth.isConnected();
    if(user && (user.email == topic.owner || (topic.editors as (string | null)[]).includes(user.email))){
      addDoc(collection(this.firestore, "topics/" + topic.id + "/posts"), {name: post.name, description: post.description });
      this.presentToast('success', 'Post successfully created');
    }else{
      this.presentToast('danger', "You don't have the permissions to do that");
    }
  }

  removePost(postId: string, topic: Topic): void {
    const user = this.auth.isConnected();
    if(user && (user.email == topic.owner || (topic.editors as (string | null)[]).includes(user.email))){
      deleteDoc(doc(this.firestore, "topics/" + topic.id + "/posts", postId))
      this.presentToast('success', 'Post successfully deleted');
    }else{
      this.presentToast('danger', "You don't have the permissions to do that");
    }
  }

  updatePost(topic: Topic, post: Post): void {
    const user = this.auth.isConnected();
    if(user && (user.email == topic.owner || (topic.editors as (string | null)[]).includes(user.email))){
      updateDoc(doc(this.firestore, "topics/" + topic.id + "/posts", post.id), { name: post.name, description: post.description })
      this.presentToast('success', 'Post successfully updated');
    }else{
      this.presentToast('danger', "You don't have the permissions to do that");
    }
  }

  addNewReader(topicId: string, editorName: string){
    updateDoc(doc(this.firestore, "topics", topicId), { readers: arrayUnion(editorName) })
    this.presentToast('success', 'Reader successfully added');
  }

  addNewEditor(topicId: string, editorName: string){
    updateDoc(doc(this.firestore, "topics", topicId), { editors: arrayUnion(editorName) })
    this.presentToast('success', 'Editor successfully added');
  }

  deleteReader(topicId: string, readerName: string){
    updateDoc(doc(this.firestore, "topics", topicId), { readers: arrayRemove(readerName) })
    this.presentToast('success', 'Reader successfully removed');
  }

  deleteEditor(topicId: string, readerName: string){
    updateDoc(doc(this.firestore, "topics", topicId), { editors: arrayRemove(readerName) })
    this.presentToast('success', 'Editor successfully removed');
  }

  private async presentToast(color: 'success' | 'danger', message: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

}
