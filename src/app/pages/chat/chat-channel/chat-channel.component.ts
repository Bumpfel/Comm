import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../../services/auth.service';
import { GlobalService } from '../../../services/global.service';
import { ActivatedRoute } from '@angular/router';
// import { MessageService } from '../../../services/message.service';
import { ChatService } from '../../../services/chat.service';

import { ChatChannel, ChatMsg } from '../../../interfaces/chat';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent implements OnInit {

  user: User;

  // chatId: string;

  activeChannelRef: AngularFirestoreDocument<ChatChannel>;
  activeChannel: ChatChannel;
  chatMsgCollection: AngularFirestoreCollection<ChatMsg>;
  chatMsgs: ChatMsg[];

  // newMsg: string;
  // senderName: string;


  constructor(private afs: AngularFirestore,
              private chatService: ChatService,
              private authService: AuthService,
              // private globalService: GlobalService,
              private route: ActivatedRoute,
              // private messageService: MessageService
              ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // this.chatId = ;
      this.activeChannelRef = this.afs.doc<ChatChannel>('chat/' + params['id']);
      this.activeChannelRef.valueChanges().subscribe(channel => {
        // if (channel) {
          this.activeChannel = channel;
          this.chatMsgCollection = this.activeChannelRef.collection<ChatMsg>('msgs/', ref => ref.orderBy('time'));
          this.activeChannelRef.collection<ChatMsg>('msgs/', ref => ref.orderBy('time')).valueChanges().subscribe(msgs => {
            this.chatMsgs = msgs;
          });
        // }
      });
    });
    this.authService.user$.subscribe(user => this.user = user);
  }

  ngAfterContentInit() {
    setTimeout(() => this.scroll(), 1500);
  }

  scroll() {
    // console.log("scrolling...");
    if(document.getElementById('bottom') != null)
      document.getElementById('bottom').scrollIntoView({ block: 'nearest', inline: "start" });
    // else
    //   console.log('null. avoiding scroll');
  }

}
