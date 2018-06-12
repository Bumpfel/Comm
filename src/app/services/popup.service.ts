import { Injectable } from '@angular/core';

@Injectable()
export class PopupService {
  
  confirmPopup: string;
  confirmPopupLineTwo: string;
  action: Function;

  createChannelPopup: string;
  
  constructor() { }
  
  newConfirmPopup(text: string, text2: string, callback: Function) : void {
    this.closePopups();
    this.confirmPopup = text;
    this.confirmPopupLineTwo = text2;
    this.action = callback;
  }

  newCreateChannelPopup(text: string) : void {
    this.closePopups();
    this.createChannelPopup = text;
    // this.action = callback;
  }
  
  executeAction(arg: string) {
    this.action.apply(arg);
    // this.closePopups();
  }
  
  closePopups() {
    this.confirmPopup = undefined
    this.confirmPopupLineTwo = undefined;
    this.action = undefined;
    this.createChannelPopup = undefined;
  }
}
