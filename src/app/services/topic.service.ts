import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  topics: Topic[] = []
  topicIdGen: number = 0;

  constructor() {
    this.newTopic("Topic 1");
    this.addPost({
      Description: "LOLOLO",
      id: "1",
      name: "Post 1"
    },"1")
    this.newTopic("Topic 2");
    this.addPost({
      Description: "LOLOLO",
      id: "1",
      name: "Post 1"
    },"2")
    this.newTopic("Topic 3");
    this.addPost({
      Description: "LOLOLO",
      id: "1",
      name: "Post 1"
    },"3")
   }

  getAll(): Topic[] {
    return this.topics;
  }

  get(topicId: string): Topic | undefined {
    return this.topics.find(topic => {
      topic.id === topicId
    })
  }

  addTopic(topic: Topic): void {
    this.topics.push(topic);
  }

  addPost(post:Post, topicId: string): void {
    this.get(topicId)?.posts.push(post);
  }

  newTopic(topicName: string) : void {
    this.addTopic({
      id: "" + this.topicIdGen++,
      name: topicName,
      posts: []
    })
  }

  removeTopic(topicId: string): void {
    this.topics = this.topics.filter(topic => topic.id !== topicId)
  }

}
