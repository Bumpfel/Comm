import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore } from 'angularfire2/firestore';

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
      let userRef = this.afs.doc<User>('users/' + credentials.user.uid);
      userRef.set({ 'uid': credentials.user.uid, 'email': credentials.user.email, 'displayName': credentials.user.displayName, 'chatName': this.getChatName(credentials.user.displayName), 'chatNameColour': this.globalService.getRandomColour("6789a"), guest: false }, { merge: true });
    });
  }

  anonymousLogin(name: string): void {
    if (name && name.trim().length > 0) {
      let userName = name.trim() + ' (guest)';
      this.afAuth.auth.signInAnonymously().then(credentials => {
        let userRef = this.afs.doc<User>('users/' + credentials.uid);
        userRef.set({ 'uid': credentials.uid, 'email': '', 'displayName': userName, 'chatName': userName, 'chatNameColour': '#aaa', guest: true }, { merge: true });
      });
    }
    else
      this.messageService.addMessage("error", "User name cannot be empty");
  }

  logout(): void {
    this.afAuth.auth.signOut()
      .then(() => {
        this.messageService.addMessage("", "You are now logged out");
        if (!this.user.email || this.user.email.length == 0) {
          this.afs.doc('users/' + this.user.uid).delete();
        }
      });
  }

  getChatName(displayName: string): string {
    let separator = displayName.indexOf(" ");
    let name = displayName;
    if (separator > 0)
      name = displayName.substr(0, separator);
    return name;
  }
}
