import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topics$: BehaviorSubject<Topic[]> = new BehaviorSubject<Topic[]>([])
  topicIdGen: number = 1;
  postIdGen: number = 1;

  constructor() {
    this.newTopic("Topic 1");
    this.newPost("1", "Post 1", "LOLOLO");
    this.newPost("1", "Post 3", "LOLOLO");

    this.newTopic("Topic 2");
    this.newPost("2", "Post 1", "LOLOLO");

    this.newTopic("Topic 3");
    this.newPost("3", "Post 1", "LOLOLO");  
   }

  getAll(): Observable<Topic[]> {
    return this.topics$.asObservable();
  }

  get(topicId: string): Observable<Topic> {
    return this.getAll().pipe(map((topics: Topic[]) => topics.find(topic => topic.id === topicId))) as Observable<Topic>
  }

  addTopic(topic: Topic): void {
    this.topics$.next([...this.topics$.getValue(), topic]);
  }

  removeTopic(topicId: string): void {
    this.topics$.next(this.topics$.getValue().filter((topic: Topic) => topic.id !== topicId));
  }

  addPost(post:Post, topicId: string): void {
   this.topics$.next(this.topics$.getValue().map((topic: Topic) => topic.id === topicId ? {...topic, posts: [...topic.posts, post]} : topic))
  }

  removePost(postId: string, topicId:string): void {
    this.topics$.next(this.topics$.getValue().map((topic: Topic) => topic.id === topicId ? {...topic, posts: topic.posts.filter((post: Post) => post.id !== postId)} : topic))
  }

  newTopic(topicName: string) : void {
    this.addTopic({
      id: "" + this.topicIdGen++,
      name: topicName,
      posts: []
    })
  }

  newPost(topicId: string, postName: string, postDesc: string): void {
    this.addPost({
      id: "" + this.postIdGen++,
      name: postName,
      description: postDesc
    }, topicId)
  }

}
