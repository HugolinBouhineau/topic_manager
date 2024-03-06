import { Routes } from '@angular/router';
import { TopicComponent } from './components/topic/topic.component';
import { PostComponent } from './components/post/post.component';
import { AuthGuard } from './auth.guard';

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
    component: TopicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "topic/:topicId/:postId",
    component: PostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.page').then( m => m.RegisterPage)
  }
];
