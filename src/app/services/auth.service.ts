import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithRedirect, sendPasswordResetEmail, sendEmailVerification, signInWithCredential } from '@angular/fire/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { ToastController, isPlatform } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private toastCtrl: ToastController) { 
    if(!isPlatform('capacitor')){
      GoogleAuth.initialize();
    }
  }

  async signInWithGoogle(): Promise<any>{
    const user = await GoogleAuth.signIn()
    const credentials = GoogleAuthProvider.credential(user.authentication.idToken);
    return signInWithCredential(this.auth, credentials);
  }

  createUser(email: string, password: string): Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  signIn(email: string, password: string): Promise<UserCredential>{
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    const p : Promise<void> = sendPasswordResetEmail(this.auth, email);
    p.then(res => this.presentToast('success', 'An email to reset your password has been sent'));
    return p;
  }

  sendEmailVerification(user: User): Promise<void> {
    const p : Promise<void> = sendEmailVerification(user);
    p.then(res => this.presentToast('success', 'An email to verify your account has been sent'));
    return p;
  }

  signOut(): Promise<void>{
    return signOut(this.auth)
  }

  isConnected(): User | null {
    return this.auth.currentUser;
  }

  private async presentToast(color: 'success' | 'danger', message: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

}
