import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgetPasswordPage {
  forgetPasswordForm = new FormGroup({
    email: new FormControl('', Validators.compose([
      Validators.required,
    ]))
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController) { }

  submit(): void {
    const { email } = this.forgetPasswordForm.getRawValue();
    if (email) {
      this.authService.sendPasswordResetEmail(email).then(res => {
        this.router.navigate(['/login']);
      }).catch(err => {
        this.presentToast();
        console.log(err.message);
      })
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Email was not found",
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
