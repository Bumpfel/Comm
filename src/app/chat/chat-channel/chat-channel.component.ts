import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent implements OnInit {

  chatId: string;

  activeChatChannelRef: AngularFirestoreDocument<ChatChannel>;
  activeChatChannel: ChatChannel;
  chatMsgCollection: AngularFirestoreCollection<ChatMsg>;
  chatMsgs: ChatMsg[];

  newMsg: string;
  senderName: string;
  prevSenderId: string;

  user: User;

  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.chatId = params['id'];
      this.activeChatChannelRef = this.afs.doc<ChatChannel>('chat/' + this.chatId);
      this.activeChatChannelRef.valueChanges().subscribe(channel => {
        if (channel) {
          this.activeChatChannel = channel;
          this.chatMsgCollection = this.activeChatChannelRef.collection<ChatMsg>('msgs/', ref => ref.orderBy('time'));
          this.activeChatChannelRef.collection<ChatMsg>('msgs/', ref => ref.orderBy('time')).valueChanges().subscribe(msgs => {
            this.chatMsgs = msgs;
          });
        }
      });
    });

    this.authService.user$.subscribe(user => this.user = user);
  }

  addMsg(): void {
    if (this.checkMsgValidity()) {
      this.activeChatChannelRef.update({ 'nextChatId': (this.activeChatChannel.nextChatId + 1) });
      let senderName = this.setSenderName();

      let smt = this.chatMsgCollection.doc('' + this.activeChatChannel.nextChatId)
        .set({ 'id': this.activeChatChannel.nextChatId, 'content': this.newMsg, 'senderId': this.user.uid, 'sender': senderName, 'userColour': this.user.chatNameColour, 'time': this.globalService.getTimeStamp() })
      // .then(() => this.scroll());
      this.newMsg = undefined;
    }
  }

  setSenderName(): string {
    let separator = this.user.displayName.indexOf(" ");
    let name = this.user.displayName;
    if (separator > 0)
      name = this.user.displayName.substr(0, separator);
    return name;
  }
  setPrevSenderId(id: string): void {
    this.prevSenderId = id;
  }

  scroll() {
    console.log("scrolling...");
    document.getElementById('bottom').scrollIntoView({ block: 'nearest', inline: "start" });
  }

  checkMsgValidity(): boolean {
    if (this.newMsg == undefined)
      return false;
    return this.newMsg.trim().length > 0;
  }

  deleteItem(id: string): void {
    this.chatMsgCollection.doc('' + id).delete();
  }

  printTime(time: string): string {
    return time.slice(11, 16);
  }

  
}
