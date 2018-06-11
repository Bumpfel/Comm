import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';

@Injectable()
export class AuthService {

  public user$: Observable<User>;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private globalService: GlobalService) {

    this.user$ = this.afAuth.authState.switchMap(authUser => {
      if(authUser)
        return this.afs.doc<User>('users/' + authUser.uid).valueChanges();
      else
        return Observable.of(null);
    });
  }

  googleLogin() : void {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUser(credential.user);
    });
  }
  
  logout() : void {
    this.afAuth.auth.signOut();
  }
  
  // anonymousLogin(name: string) {
  //   this.updateUser(this.user);
  //   this.afAuth.auth.signInAnonymously().then(credential => {
  //   });
  // }
  
  updateUser(userCred: User) : void {
    var userColour = this.globalService.getRandomColour();

    var userRef = this.afs.doc<User>('users/' + userCred.uid);
    userRef.set({ uid: userCred.uid, email: userCred.email, displayName: userCred.displayName, chatNameColour: userColour}, { merge: true });
  }
}
