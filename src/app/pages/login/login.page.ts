import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonFabButton, IonIcon, IonFab, IonRow } from '@ionic/angular/standalone'
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';

addIcons({"logo-google": logoGoogle})

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonRow, IonFab, IonIcon, IonFabButton, RouterLink, IonList, CommonModule, FormsModule, IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ReactiveFormsModule]
})

export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
    ])),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) { }

  submit(): void {
    const { email, password } = this.loginForm.getRawValue();
    if (email && password) {
      this.authService.signIn(email, password).then(res => {
        this.router.navigate(['/home']);
      }).catch(err => {
        this.loginForm.setErrors({ wrongCredentials: true })
      });
    }
  }

  toRegisterPage() {
    this.router.navigate(['/register']);
  }

  resetPassword() {
    this.router.navigate(['/forget-password']);
  }

  loginWithGmail(): void {
    this.authService.signInWithGoogle().then(res => {
      this.router.navigate(['/home']);
    })
  }

}
