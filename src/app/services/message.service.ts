import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  messages: Message[] = [];
  iconClass: Map<string, string> = new Map([
    ["add", "fa fa-plus"],
    ["delete", "fa fa-trash-o"],
    ["update", "fa fa-pencil"],
    ["error", "fa fa-ban"],
  ]);
  
  
  timeout: number = 7000;

  constructor() {
  }


  addMessage(action: string, msg: string) {
    this.messages.push({ type: action, text: msg, icon: this.iconClass.get(action) });
    setTimeout(() => this.messages.shift(), this.timeout);
  }

}
