import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { MessageService } from '../../services/message.service';
import { PopupService } from '../../services/popup.service';
import { ChatService } from '../../services/chat.service';

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

  // confirmDeletion: boolean; //temp

  // chatChannelCollection: AngularFirestoreCollection<ChatChannel>;
  chatChannels: Observable<ChatChannel[]>;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private chatService: ChatService,
              // private globalService: GlobalService,
              private messageService: MessageService,
              private popupService: PopupService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.user = user);
    // this.chatChannelCollection = this.afs.collection<ChatChannel>('chat/');
    this.chatChannels = this.afs.collection<ChatChannel>('chat/', ref => ref.where('id', '>=', '0')).valueChanges();
  }

  newChatChannel() {
    this.chatService.newChatChannel(this.newChatChannelName);
    this.newChatChannelName = undefined;
  }

  confirmPopup(text: string, text2: string, id: number) {
    this.popupService.newConfirmPopup(text, text2, () => this.chatService.deleteChatChannel(id));
  }

  createPopup(title: string) {
    this.popupService.newCreateChannelPopup(title); //, () => this.chatService.newChatChannel("hej"));
  }
  fieldFocus() {
    // this.el.nativeElement.focus();
  }

}
