import { Routes } from '@angular/router';
import { TopicComponent } from './components/topic/topic.component';
import { PostComponent } from './components/post/post.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: "topic/:id",
    component: TopicComponent
  },
  {
    path: "topic/:topicId/:postId",
    component: PostComponent
  }
];
