import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { Observable, map } from 'rxjs';
import { CollectionReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topicsCollection: CollectionReference;

  constructor(private firestore: Firestore, private toastCtrl: ToastController) {
    this.topicsCollection = collection(this.firestore, 'topics');
   }

  getTopics(): Observable<Topic[]> {
    const data = collectionData(this.topicsCollection, { idField: 'id' }) as Observable<Topic[]>;
    //data.subscribe(data => console.log(data));
    return data;
  }

  getTopic(topicId: string): Observable<Topic> {
   return docData(doc(this.firestore, 'topics/' + topicId), { idField: 'id' }) as Observable<Topic>;
  }

  getPosts(topicId: string): Observable<Post[]> {
    return collectionData(collection(this.firestore, "topics/"+topicId+"/posts"), { idField: 'id' }) as Observable<Post[]>;
  }

  getPost(topicId: string, postId: string): Observable<Post> {
    return this.getPosts(topicId).pipe(map((posts: Post[]) => posts.find(post => post.id === postId))) as Observable<Post>
  }
  
  addTopic(topic: Topic): void {
    addDoc(this.topicsCollection, { name: topic.name });
    this.presentToast('success', 'Topic successfully created');
  }

  removeTopic(topicId: string): void {
    const sub = this.getPosts(topicId).forEach((posts: Post[]) => {
      posts.forEach((post: Post) => this.removePost(post.id, topicId))
    });
    deleteDoc(doc(this.firestore, "topics", topicId));
    this.presentToast('success', 'Topic successfully deleted');
  }

  addPost(post: Post, topicId: string): void {
    addDoc(collection(this.firestore, "topics/"+topicId+"/posts"), {name: post.name, description: post.description });
    this.presentToast('success', 'Post successfully created');
  }

  removePost(postId: string, topicId: string): void {
    deleteDoc(doc(this.firestore, "topics/"+topicId+"/posts", postId))
    this.presentToast('success', 'Post successfully deleted');
  }

  updatePost(topicId: string, post: Post): void {
    updateDoc(doc(this.firestore, "topics/"+topicId+"/posts", post.id), { name: post.name, description: post.description })
    this.presentToast('success', 'Post successfully modified');
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
