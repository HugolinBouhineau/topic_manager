import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonFabButton, IonIcon, IonFab, IonRow, ToastController } from '@ionic/angular/standalone'
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import {NgxSnakeModule} from 'ngx-snake';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';

addIcons({"logo-google": logoGoogle})

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [NgxSnakeModule, IonRow, IonFab, IonIcon, IonFabButton, RouterLink, IonList, CommonModule, FormsModule, IonInput, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ReactiveFormsModule]
})

export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
    ])),
    password: new FormControl('', Validators.required)
  });

  showSnake: boolean = false;
  accelHandler!: PluginListenerHandle;
  log: string = "";
  delay: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
    ) { this.snake() }

  async snake(){
    // Once the user approves, can start listening:
    this.accelHandler = await Motion.addListener('accel', event => {
      //this.log = "accelx : " + event.acceleration.x +"\naccely : "+event.acceleration.y +"\naccelz : "+event.acceleration.z +"\n";
      if(this.delay && Math.sqrt(Math.pow(event.acceleration.x, 2) + Math.pow(event.acceleration.y, 2) + Math.pow(event.acceleration.z, 2)) >= 15){
        this.delay = false;
        this.showSnake = !this.showSnake;
        setTimeout(() => {
          this.delay = true;
        }, 1000);
      }
    });
  }

  submit(): void {
    const { email, password } = this.loginForm.getRawValue();
    if (email && password) {
      this.authService.signIn(email, password).then(res => {
        if (!res.user.emailVerified) {
          this.presentToast("Your email is not verified !")
          this.authService.signOut();
        } else {
          this.router.navigate(['/home']);
        }
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

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
