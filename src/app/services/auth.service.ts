import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithRedirect, sendPasswordResetEmail, sendEmailVerification, signInWithCredential } from '@angular/fire/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { 
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
    return sendPasswordResetEmail(this.auth, email);
  }

  sendEmailVerification(user: User): Promise<void> {
    return sendEmailVerification(user);
  }

  signOut(): Promise<void>{
    return signOut(this.auth)
  }

  isConnected(): User | null {
    return this.auth.currentUser;
  }

}
