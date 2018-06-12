import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { MessageService } from './message.service';

@Injectable()
export class AuthService {

  public user$: Observable<User>;
  private user: User;

  constructor(private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private globalService: GlobalService,
    private messageService: MessageService) {

    this.user$ = this.afAuth.authState.switchMap(authUser => {
      if (authUser)
        return this.afs.doc<User>('users/' + authUser.uid).valueChanges();
      else
        return Observable.of(null);
    });
    this.user$.subscribe(user => this.user = user);
  }

  googleLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(credentials => {
      console.log("photo url " + credentials.photoUrl);
      this.updateUser(credentials.user, this.globalService.getRandomColour("56789ab"));
    });
  }

  anonymousLogin(name: string): void{
    if (name && name.trim().length > 0) {
      let username = name.trim();
      this.afAuth.auth.signInAnonymously().then(credentials => {
        this.updateUser({ 'uid': credentials.uid, 'email': '', 'displayName': username + '(guest)' }, "a");

        // var userRef = this.afs.doc<User>('users/' + credentials.uid);
        // userRef.set({ uid: credentials.uid, email: "", displayName: name + "(guest)", chatNameColour: "black" }, { merge: true });
      });
    }
    else
      this.messageService.addMessage("error", "User name cannot be empty");
  }

  logout(): void {
    this.afAuth.auth.signOut().then(() => {
      this.messageService.addMessage("", "You are now logged out");
      if (!this.user.email || this.user.email.length == 0) {
        this.afs.doc('users/' + this.user.uid).delete();
      }
    });
  }


  updateUser(userCred: User, userColour: string): void {
    let userRef = this.afs.doc<User>('users/' + userCred.uid);
    userRef.set({ uid: userCred.uid, email: userCred.email, displayName: userCred.displayName, chatNameColour: userColour }, { merge: true });
  }
}
