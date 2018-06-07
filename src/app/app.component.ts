import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Subscription } from 'rxjs/Subscription';

interface Forum {
  name: string;
  description: string;
}

interface ChatChannel {
  name: string;
}

interface ChatMsg {
  id: number;
  content: string;
  time: any;
  sender: string;
  senderUid: string;
  userColour: string;
}

interface Global {
  nextChatId: number;
}

interface User {
  admin?: boolean;
  uid: string;
  displayName: string;
  email: string;
  chatNameColour: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  forumsCollection: AngularFirestoreCollection<Forum>;
  forums: Observable<Forum[]>;

  chatChannelCollection: AngularFirestoreCollection<ChatChannel>;
  chatChannels: Observable<ChatChannel[]>;

  activeChatChannelName: string;
  chatMsgCollection: AngularFirestoreCollection<ChatMsg>;
  chatMsgs: Observable<ChatMsg[]>;

  nextChatId: number;

  newMsg: string;
  senderName: string;
  prevSenderId: string;

  user: User;
  // userRef;
  user$: Observable<any>;
  userSub: Subscription;

  constructor(private afs: AngularFirestore,
    private afAuth: AngularFireAuth) {

  }

  ngOnInit() {
    this.forumsCollection = this.afs.collection('forum/');
    this.forums = this.forumsCollection.valueChanges();

    this.chatChannelCollection = this.afs.collection('chat/');
    this.chatChannels = this.chatChannelCollection.valueChanges();

    var activeChatChannelRef = this.afs.doc<ChatChannel>('chat/8gxTy0q6ZzMu5yXA2Fam/');
    activeChatChannelRef.valueChanges().subscribe(channel => this.activeChatChannelName = channel.name);
    this.chatMsgCollection = activeChatChannelRef.collection('msgs/', ref => ref.orderBy('time'));
    this.chatMsgs = this.chatMsgCollection.valueChanges();

    this.afs.doc<Global>('data/global/').valueChanges().subscribe(doc => this.nextChatId = doc.nextChatId);

    
    this.user$ = this.afAuth.authState.switchMap(authUser => {
      if(authUser)
        return this.afs.doc<User>('users/' + authUser.uid).valueChanges();
      else
        return Observable.of(null);
    });
    this.userSub = this.user$.subscribe(user => this.user = user);
  }
  
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUser(credential.user);
    });
  }
  
  logout() {
    // this.userSub.unsubscribe();
    this.afAuth.auth.signOut();
  }
  
  // anonymousLogin(name: string) {
  //   this.updateUser(this.user);
  //   this.afAuth.auth.signInAnonymously().then(credential => {
  //   });
  // }
  
  updateUser(userCred: User) {
    // this.userRef.valueChanges().subscribe(user => this.user = user);
    var userRef = this.afs.doc<User>('users/' + userCred.uid);
    userRef.set({ uid: userCred.uid, email: userCred.email, displayName: userCred.displayName, chatNameColour: this.getRandomColour() }, { merge: true });
  }

  getRandomColour() {
      var str = "#";
      var possible = "bcd456";
    
      for (var i = 0; i < 3; i++)
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    
      console.log(str);
      return str;
  }

  test() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(credential => {
      console.log(credential.Ya.j);
    });

    this.afAuth.auth.signInAnonymously().then(credential => {
      this.updateUser(credential.user);
    });
  }

  addMsg() {
    if (this.checkMsgValidity()) {
      this.afs.doc('data/global').update({ 'nextChatId': this.nextChatId + 1 });

      var separator = this.user.displayName.indexOf(" ");
      var senderName = this.user.displayName.substr(0, separator);

      this.chatMsgCollection.doc('' + this.nextChatId).set({ 'id': this.nextChatId, 'content': this.newMsg, 'senderId': this.user.uid, 'sender': senderName, 'userColour': this.user.chatNameColour,'time': this.getTimeStamp() })
      this.newMsg = undefined;

      setTimeout(() => { document.getElementById('bottom').scrollIntoView(); }, 100);
    }
  }

  setPrevSenderId(id: string) {
    this.prevSenderId = id;
  }

  scroll() {
    document.getElementById('bottom').scrollIntoView();
  }

  // setName(name: string) {
  //   this.senderName = name;
  // }

  checkMsgValidity() {
    if (this.newMsg == undefined)
      return false;
    return this.newMsg.trim().length > 0;
  }

  deleteItem(id: string) {
    this.chatMsgCollection.doc('' + id).delete();
  }

  printTime(time: string) {
    return time.slice(11, 16);
  }

  getTimeStamp() {
    var date = new Date();
    var YY = date.getFullYear();

    var M = date.getMonth() + 1;
    var MM: string = "" + M;
    if (M < 10)
      MM = "0" + M;

    var D = date.getDate();
    var DD: string = "" + D;
    if (D < 10)
      DD = "0" + D;

    var h = date.getHours();
    var hh: string = "" + h;
    if (h < 10)
      hh = "0" + h;

    var m = date.getMinutes();
    var mm: string = "" + m;
    if (m < 10)
      mm = "0" + m;

    var s = date.getSeconds();
    var ss: string = "" + s;
    if (s < 10)
      ss = "0" + s;

    var ms = date.getMilliseconds();
    var mss: string = "" + ms;
    if (ms < 10)
      mss = "00" + ms;
    else if (ms < 100)
      mss = "0" + ms;

    var formattedDate = YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss + "." + mss;
    return formattedDate;
  }
}
