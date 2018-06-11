import { Injectable } from '@angular/core';

@Injectable()
export class PopupService {
  
  confirmPopup: string;
  action: Function;

  constructor() { }

  newConfirmPopup(text: string, callback: Function) : void {
    this.confirmPopup = text;

    this.action = callback;
  }
  
  executeAction() {
    this.action.apply(0);
    this.closePopups();
  }

  closePopups() {
    this.confirmPopup = undefined
    this.action = undefined;
  }
}
