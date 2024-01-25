import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topics: Topic[] = []
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

  getAll(): Topic[] {
    return this.topics;
  }

  get(topicId: string): Topic | undefined {
    return this.topics.find(topic => topic.id === topicId)
  }

  addTopic(topic: Topic): void {
    this.topics.push(topic);
  }

  removeTopic(topicId: string): void {
    this.topics = this.topics.filter(topic => topic.id !== topicId)
  }

  addPost(post:Post, topicId: string): void {
    this.get(topicId)?.posts.push(post);
  }

  removePost(postId: string, topicId:string): void {
    const topic: Topic | undefined = this.get(topicId);
    if (topic){
      topic.posts = topic.posts.filter(post => post.id !== postId);
    }
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
