import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { PopupService } from './popup.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable()
export class ChatService {

  user: User;

  allChannels$: Observable<ChatChannel[]>;
  allChannels: ChatChannel[];

  showDeleteConfirmation: boolean;
  showCreateChannnelDialog: boolean;
  actionInProgress: boolean;

  newMsg: string;

  constructor(private afs: AngularFirestore,
              private messageService: MessageService,
              private authService: AuthService,
              private globalService: GlobalService) {
    this.allChannels$ = this.afs.collection<ChatChannel>('chat/').valueChanges();
    this.allChannels$.subscribe(channels => this.allChannels = channels);
    this.authService.user$.subscribe(user => this.user = user)
  }

  //---------------- Chat lobby functions ----------------//

  newChannel(name: string, description: string) {
    this.actionInProgress = true;
    let trimmedName = name.trim();
    if (this.isNotEmpty(trimmedName)) {
      if (this.isUniqueName(trimmedName)) {
        this.afs.collection<ChatChannel>('chat').add({ 'id': '-1', 'name': trimmedName, 'name_key': trimmedName.toLowerCase(), 'description': description.trim(), 'nextChatId': 0 })
          .then((docRef) => {
            docRef.update({ 'id': docRef.id });
            this.showCreateChannnelDialog = false;
            this.actionInProgress = false;
            this.messageService.addMessage("add", "Channel created");
          })
          .catch((error) => {
            this.actionInProgress = false;
            this.messageService.addMessage("error", "Error creating channel: " + error);
          });
      }
      else {
        this.actionInProgress = false;
        this.messageService.addMessage("error", "Channel name already exists")
        return;
      }
    }
    else {
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Cannot create a channel with an empty name")
    }
  }

  deleteChannel(id: number): void {
    this.showDeleteConfirmation = false;
    let docRef = this.afs.doc('chat/' + id);
    let colRef = docRef.collection<ChatMsg>('/msgs/');
    colRef.valueChanges().subscribe(msgs => {
      for (let msg of msgs)
        colRef.doc<ChatMsg>('' + msg.id).delete();
    });
    this.afs.doc('chat/' + id).delete()
      .then(() => {
        this.showDeleteConfirmation = false;
        this.messageService.addMessage("delete", "Channel deleted");
      })
      .catch((error) => {
        this.messageService.addMessage("error", "Error deleting channel: " + error);
      });
  }

  isNotEmpty(name: string) {
    return name.trim().length > 0;
  }

  isUniqueName(name: string) {
    if(this.allChannels.find(channel => name.toLowerCase() == channel.name_key))
      return false;
    return true;
  }


  //------------------- Chat channel functions --------------------//

  addMsg(newMsg: string, activeChatChannel: ChatChannel): void {
    let activeChatChannelRef = this.afs.doc<ChatChannel>('chat/' + activeChatChannel.id);
    if (this.checkMsgValidity(newMsg)) {
      activeChatChannelRef.collection<ChatMsg>('msgs/').doc('' + activeChatChannel.nextChatId)
        .set({ 'id': activeChatChannel.nextChatId, 'content': newMsg, 'senderId': this.user.uid, 'sender': this.user.chatName, 'userColour': this.user.chatNameColour, 'time': this.globalService.getTimeStamp() })
        .then(() => activeChatChannelRef.update({ 'nextChatId': activeChatChannel.nextChatId + 1 }));
     }
  }

  checkMsgValidity(msg: string): boolean {
    if (msg == undefined)
      return false;
    return msg.trim().length > 0;
  }

  deleteMsg(channelId: string, msgId: string): void {
    this.afs.doc('chat/' + channelId + '/msgs/' + msgId).delete()
      // .then(() => this.messageService.addMessage("delete", "Message deleted"));
  }

  printTime(time: string): string {
    return time.slice(11, 16);
  }

}
