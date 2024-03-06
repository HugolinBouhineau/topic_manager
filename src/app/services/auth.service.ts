import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  createUser(email: string, password: string): Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.auth, email, password)
  }
  
  signIn(email: string, password: string): Promise<UserCredential>{
    return signInWithEmailAndPassword(this.auth, email, password)
  }
  
  signOut(): Promise<void>{
    return signOut(this.auth)
  }
  
  isConnected(): User | null {
    return this.auth.currentUser;
  }

}
