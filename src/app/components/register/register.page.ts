import { AuthService } from './../../services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonList, IonTextarea, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonTextarea, IonContent, IonList, IonItem, IonInput, IonButton, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
    ) { }

  registerForm!: FormGroup;
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.registerForm = this.fb.nonNullable.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      password: ['', Validators.required]
    });
  }

  register(): void {
    const {email, password} = this.registerForm.getRawValue();
    this.authService.createUser(email, password).then(res => {
      const user = this.authService.isConnected();
      if (user) {
        this.authService.sendEmailVerification(user).then(res => {
          console.log("email verification send !")
          this.authService.signOut().then(res => {this.router.navigate(['/login']);});

        }).catch(err => {
          this.presentToast("Your email was not found");
          this.authService.signOut();
        });
      }
    }).catch(err => {
      this.presentToast("Your email is already used")
    });
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
