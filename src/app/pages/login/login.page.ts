import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList } from '@ionic/angular/standalone'
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [RouterLink, IonList, CommonModule, FormsModule, IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ReactiveFormsModule]
})
export class LoginPage  {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$')
    ])),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) { }

  submit(): void {
    const { email, password } = this.loginForm.getRawValue();
    if (email && password) {
      this.authService.signIn(email, password).then(res => {
        this.router.navigate(['/home']);
      }).catch(rr => console.log(rr));
    }
  }

  toRegisterPage() {
    this.router.navigate(['/register'])
  }

}