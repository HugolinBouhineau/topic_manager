import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { Observable, map } from 'rxjs';
import { CollectionReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topicsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.topicsCollection = collection(this.firestore, 'topics');
   }

  getTopics(): Observable<Topic[]> {
    const data = collectionData(this.topicsCollection, { idField: 'id' }) as Observable<Topic[]>;
    //data.subscribe(data => console.log(data));
    return data;
  }

  getTopic(topicId: string): Observable<Topic> {
    return this.getTopics().pipe(map((topics: Topic[]) => topics.find(topic => topic.id === topicId))) as Observable<Topic>
  }

  getPosts(topicId: string): Observable<Post[]> {
    return collectionData(collection(this.firestore, "topics/"+topicId+"/posts"), { idField: 'id' }) as Observable<Post[]>;
  }

  getPost(topicId: string, postId: string): Observable<Post> {
    return this.getPosts(topicId).pipe(map((posts: Post[]) => posts.find(post => post.id === postId))) as Observable<Post>
  }
  
  addTopic(topic: Topic): void {
    addDoc(this.topicsCollection, { name: topic.name });
  }

  removeTopic(topicId: string): void {
    deleteDoc(doc(this.firestore, "topics", topicId))
  }

  addPost(post: Post, topicId: string): void {
    addDoc(collection(this.firestore, "topics/"+topicId+"/posts"), {name: post.name, description: post.description });
  }

  removePost(postId: string, topicId: string): void {
    deleteDoc(doc(this.firestore, "topics/"+topicId+"/posts", postId))
  }

  updatePost(topicId: string, post: Post): void {
    updateDoc(doc(this.firestore, "topics/"+topicId+"/posts", post.id), { name: post.name, description: post.description })
  }

}
