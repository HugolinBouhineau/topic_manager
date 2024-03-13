import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithRedirect, sendPasswordResetEmail, sendEmailVerification } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private googleProvider = new GoogleAuthProvider();

  constructor(private auth: Auth) { }

  createUser(email: string, password: string): Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  signIn(email: string, password: string): Promise<UserCredential>{
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  signInWithGoogle(): Promise<UserCredential>{
    return signInWithRedirect(this.auth, this.googleProvider);
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
