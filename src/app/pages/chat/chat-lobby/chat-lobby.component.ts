import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.css']
})
export class ChatLobbyComponent implements OnInit {

  user: User;
  nextChatChannelId: number;
  newChatChannelName: string;
  showMessage: string;
  chatChannels: Observable<ChatChannel[]>;

  // these two are for a temporary bkup copy function
  wantedChannels: ChatChannel[];
  chanRef;

  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private chatService: ChatService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.user = user);
    this.chatChannels = this.afs.collection<ChatChannel>('chat/', ref => ref.where('id', '>=', '0')).valueChanges();

    // this.chanRef = this.afs.collection<ChatChannel>('chatBkup', ref => ref.where('id', '>', '-1'));
    // this.chanRef.valueChanges().subscribe(channels => this.wantedChannels = channels); // temp
  }

  copyWantedChannels() { // temp copy function
    for (let channel of this.wantedChannels) {
      let chanRef = this.afs.doc('chat/' + channel.id)
        chanRef.set({ 'id': channel.id, 'description': channel.description, 'name': channel.name, 'name_key': channel.name_key, 'nextChatId': channel.nextChatId })
        .then(() => {
          let msgsRef = this.afs.collection<ChatMsg>('chatBkup/' + channel.id + '/msgs/');
          msgsRef.valueChanges().subscribe(msgs => {
            for (let msg of msgs) {
              let msgRef = chanRef.collection('/msgs/').doc('' + msg.id);
              msgRef.set({ 'id': msg.id, 'content': msg.content, 'sender': msg.sender, 'time': msg.time });
              if(msg.userColour)
                msgRef.update({ 'userColour': msg.userColour });
              if(msg.senderId)
                msgRef.update({ 'senderId': msg.senderId });
            }
          })
         console.log(channel.name + " copy done"); 
        });
    }
  }

}
