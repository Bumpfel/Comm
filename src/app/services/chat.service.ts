import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { PopupService } from './popup.service';

@Injectable()
export class ChatService {

  constructor(private afs: AngularFirestore,
              private messageService: MessageService,
              private popupService: PopupService) { }

  newChatChannel(name: string): void {
    let newName =  name.trim();
    if(this.checkChatChannelName(newName)) {
      this.afs.collection<ChatChannel>('chat').add({ 'id': '-1', 'name': newName, 'nextChatId': 0 })
      .then((docRef) => {
        docRef.update({ 'id': docRef.id });
        this.messageService.addMessage("add", "Channel created");
        this.popupService.closePopups();
      })
      .catch((error) => {
        console.log("Error creating chat channel: " + error);
        this.messageService.addMessage("error", "Error creating channel: " + error);
      });
    }
    else {
      this.messageService.addMessage("error", "Cannot create a channel with an empty name")
    }
 }

  deleteChatChannel(id: number): void {
    let docRef = this.afs.doc('chat/' + id);
    let colRef = docRef.collection<ChatMsg>('/msgs/');
    colRef.valueChanges().subscribe(msgs => {
      for(let msg of msgs)
        colRef.doc<ChatMsg>('' + msg.id).delete();
    });
    this.afs.doc('chat/' + id).delete()
      .then(() => {
        this.messageService.addMessage("delete", "Channel deleted");
        this.popupService.closePopups();
      })
      .catch((error) => {
        this.messageService.addMessage("error", "Error deleting channel: " + error);
      });
  }

  checkChatChannelName(name): boolean {
    return name.trim().length > 0;
  }
}
