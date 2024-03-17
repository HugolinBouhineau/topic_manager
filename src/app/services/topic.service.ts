import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { Observable, map } from 'rxjs';
import { CollectionReference, Firestore, addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
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
    return collectionData(query(this.topicsCollection, where('owner', '==', this.auth.isConnected() ? this.auth.isConnected()?.email:"")), { idField: 'id' }) as Observable<Topic[]>;
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
  
  addTopic(topicName: string): void {
    addDoc(this.topicsCollection, { name: topicName, owner: this.auth.isConnected() ? this.auth.isConnected()?.email:"" });
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
