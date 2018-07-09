import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

import { ChatChannel, ChatMsg } from '../interfaces/chat';

@Injectable()
export class ChatService {

  user: User;

  allChannels$: Observable<ChatChannel[]>;
  allChannels: ChatChannel[];

  deleteChannelPopup: boolean;
  createChannelPopup: boolean;
  actionInProgress: boolean;

  newMsg: string;

  constructor(private afs: AngularFirestore,
              private messageService: MessageService,
              private authService: AuthService,
              private globalService: GlobalService) {
    this.allChannels$ = this.afs.collection<ChatChannel>('chat/').valueChanges();
    this.allChannels$.subscribe(channels => this.allChannels = channels);
    this.authService.user$.subscribe(user => this.user = user)

    window.onkeydown = (event) => {
      if (event.keyCode == 27 && !this.actionInProgress) /// esc key
        this.closePopups();
    }
  }

  setActionTimeOut(closePopups: boolean, time?: number) {
    this.actionInProgress = true;
    let defaultTime: number = 5000;

    setTimeout(() => { 
      if(this.actionInProgress)
        this.messageService.addMessage("error", "Error: Action timed out");
        this.actionInProgress = false;
        closePopups ? this.closePopups() : '';
    }, time > defaultTime ? time : defaultTime);
  }

  //---------------- Chat lobby functions ----------------//

  newChannel(name: string, description: string): void {
    this.setActionTimeOut(false);
    let trimmedName = name.trim();
    if (this.isNotEmpty(trimmedName)) {
      if (this.isUniqueName(trimmedName)) {
        // this.afs.collection<ChatChannel>('chat').add({ 'id': '-1', 'name': trimmedName, 'name_key': trimmedName.toLowerCase(), 'description': description.trim(), 'nextChatId': 0 })
        this.afs.doc<ChatChannel>('chat/' + trimmedName.toLowerCase()).set({ 'name': trimmedName, 'description': description.trim(), 'nextChatId': 0, 'protected': false })
        .then(() => {
            // docRef.update({ 'id': docRef.id });
            this.closePopups();
            this.actionInProgress = false;
            this.messageService.addMessage("add", "Channel created");
          })
          .catch(() => {
            this.actionInProgress = false;
            this.messageService.addMessage("error", "Error creating channel. Please try again later");
          });
      }
      else {
        this.actionInProgress = false;
        this.messageService.addMessage("error", "There are already a channel by that name");
      }
    }
    else {
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Cannot create a channel with an empty name");
    }
  }

  deleteChannel(name: string): void {
    this.setActionTimeOut(true);
    let docRef = this.afs.doc('chat/' + name.toLowerCase());
    let colRef = docRef.collection<ChatMsg>('/msgs/');
    colRef.valueChanges().subscribe(msgs => {
      for (let msg of msgs) {
        colRef.doc<ChatMsg>('' + msg.id).delete()
        .catch(() => console.log("Could not delete msg " + msg.id + " in channel"));
      }
    });
    docRef.delete()
      .then(() => {
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("delete", "Channel deleted");
      })
      .catch(() => {
        this.actionInProgress = false;
        this.messageService.addMessage("error", "Error deleting channel. Please try again later");
      });
  }

  isNotEmpty(name: string): boolean {
    return name.trim().length > 0;
  }

  isUniqueName(name: string): boolean {
    return this.allChannels.findIndex(channel => channel.name.toLowerCase() == name.toLowerCase()) == -1;
  }


  //------------------- Chat channel functions --------------------//

  addMsg(newMsg: string, activeChatChannel: ChatChannel): void {
    let activeChatChannelRef = this.afs.doc<ChatChannel>('chat/' + activeChatChannel.name.toLowerCase());
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

  deleteMsg(channelName: string, msgId: string): void {
    this.afs.doc('chat/' + channelName.toLowerCase() + '/msgs/' + msgId).delete()
      // .then(() => this.messageService.addMessage("delete", "Message deleted"));
  }

  printTime(time: string): string {
    return time.slice(11, 16);
  }


  //------------------------ Popup function -------------------------//

  closePopups(): void {
    this.deleteChannelPopup = undefined;
    this.createChannelPopup = undefined;
  }

  showCreateChannelPopup(el: HTMLElement): void {
    this.closePopups();
    this.globalService.setFocus('channelName');
    this.createChannelPopup = true;
    
    console.log(el.offsetTop + ", " + el.offsetLeft);
    setTimeout(() => {
      let popup = document.getElementById("createChannelPopup");
      // popup.style.display = "block";
      popup.style.top = el.offsetTop + "px";
      popup.style.left = el.offsetLeft + "px";
    }, 0);
  }

  showDeleteChannelPopup(el: HTMLElement): void {
    this.closePopups();
    this.deleteChannelPopup = true;
    
    console.log(el.offsetTop + ", " + el.offsetLeft);
    setTimeout(() => {
      let popup = document.getElementById("deleteChannelPopup");
      // popup.style.display = "block";
      popup.style.top = el.offsetTop + 160 +"px";
      popup.style.left = el.offsetLeft + 620 + "px";
    }, 0);
  }


  //------------------------- Temp function --------------------------//

  // copyChannels() {
  //   for (let channel of this.allChannels) {
  //     let newChannelRef: AngularFirestoreDocument<ChatChannel> = this.afs.doc<ChatChannel>('chat/' + channel.name.toLowerCase());
  //     newChannelRef.set({ 'name': channel.name, 'description': channel.description, 'nextChatId': channel.nextChatId, 'protected': channel.protected })
  //       .then((docRef) => {
  //         this.messageService.addMessage("add", "Channel " + channel.name +" copied");
  //         this.afs.collection<ChatMsg>("chat/" + channel.id + "/msgs").valueChanges().subscribe(msgs => {
  //           for(let msg of msgs) {
  //             // console.log(msg.id);
  //             if(!msg.userColour)
  //               msg.userColour = "#000";
  //             newChannelRef.collection("/msgs/").doc("" + msg.id).set({ 'id': msg.id, 'content': msg.content, 'sender': msg.sender, 'time': msg.time, 'userColour': msg.userColour });
  //           }
  //         });
  //       })
  //       .catch((error) => {
  //         console.log("Error copying channels: " + error);
  //     });
  //   }
  // }

}
