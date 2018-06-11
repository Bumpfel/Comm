import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { GlobalService } from '../../services/global.service';
import { MessageService } from '../../services/message.service';
import { PopupService } from '../../services/popup.service';

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
              private globalService: GlobalService,
              private messageService: MessageService,
              private popupService: PopupService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => this.user = user);
    // this.chatChannelCollection = this.afs.collection<ChatChannel>('chat/');
    this.chatChannels = this.afs.collection<ChatChannel>('chat/').valueChanges();
  }

  newChatChannel(): void {
    let newName =  this.newChatChannelName.trim(); 
    this.afs.collection<ChatChannel>('chat').add({ 'name': newName, 'nextChatId': 0 })
      .then((docRef) => {
        docRef.update({ 'id': docRef.id });
        this.messageService.addMessage("add", "Channel created");
      })
      .catch((error) => {
        console.log("Error creating chat channel: " + error);
        this.messageService.addMessage("error", "Error creating channel: " + error);
      });

    this.newChatChannelName = undefined;
  }

  deleteChatChannel(id: number): void {
    this.afs.doc('chat/' + id).delete()
      .then(() => {
        this.messageService.addMessage("delete", "Channel deleted");
      })
      .catch((error) => {
        // this.messageService.addErrMessage("Error deleting channel: " + error);
      });
  }

  checkChatChannelName(): boolean {
    return this.newChatChannelName.trim().length > 0;
  }

  popup(text: string, id: number) {
    this.popupService.newConfirmPopup(text, () => this.deleteChatChannel(id));
  }

  // confirmPopup(msg: string, action: Function) {
  //   action;
  // }
}
