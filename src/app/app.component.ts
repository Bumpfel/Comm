import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
  // senderId: number;
}

interface Global {
  nextChatId: number;
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

  chatMsgCollection: AngularFirestoreCollection<ChatMsg>;
  chatMsgs: Observable<ChatMsg[]>;

  nextChatId: number;

  newMsg: string;
  senderName: string;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  ngOnInit() {
    this.forumsCollection = this.afs.collection('forum');
    this.forums = this.forumsCollection.valueChanges();

    this.chatChannelCollection = this.afs.collection('chat');
    this.chatChannels = this.chatChannelCollection.valueChanges();

    this.chatMsgCollection = this.afs.collection('chat/ks7vyEz0rVGXv8EVRRCY/msgs', ref => ref.orderBy('time'));
    this.chatMsgs = this.chatMsgCollection.valueChanges();

    this.afs.doc<Global>('data/global/').valueChanges().subscribe(doc => this.nextChatId = doc.nextChatId);

    // setTimeout(() => { scroll() }, 1000);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then((credential) => {
      this.updateUser(credential.user);
    });
  }
  // Logs out from google.
  googleLogOut() {
    this.afAuth.auth.signOut();
  }

  updateUser(user: any) {
    this.afs.doc('users/' + user.uid).set({ uid: user.uid, email: user.email, displayName: user.displayName });
    
    // updateUser(user) {
    //   const userRef: AngularFirestoreDocument<any> = this.afs.doc('users/' + user.uid + '');
    //   const data: User = {
    //     uid: user.uid,
    //     email: user.email,
    //     displayName: user.displayName,
    //   }
    //   return userRef.set(data, { merge: true });
  
  }

  test() {
    console.log(this.nextChatId);
  }

  addMsg() {
    if (this.checkMsg()) {
      this.afs.doc('data/global').update({ 'nextChatId': this.nextChatId + 1 });

      this.chatMsgCollection.doc('' + this.nextChatId).set({ 'id': this.nextChatId, 'content': this.newMsg, 'sender': this.senderName, 'time': this.getTimeStamp() })
      this.newMsg = undefined;

      setTimeout(() => { document.getElementById('bottom').scrollIntoView(); }, 100);
    }
  }
  
  scroll() {
    document.getElementById('bottom').scrollIntoView();
  }

  setName(name: string) {
    this.senderName = name;
  }

  checkMsg() {
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
