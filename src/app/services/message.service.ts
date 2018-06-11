import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  messages: Message[] = [];
  iconClass: Map<string, string> = new Map([
    ["add", "fa fa-plus"],
    ["delete", "fa fa-trash-o"],
    ["update", "fa fa-edit"]
  ]);
  
  
  timeout: number = 4000;

  constructor() {
    // this.messages.push({ type: "add", text: "testing", icon: this.iconClass.get("add") })
    // this.messages.push({ type: "uspdate", text: "testing", icon: this.iconClass.get("update") })
    // this.messages.push({ type: "delete", text: "testing", icon: this.iconClass.get("delete") })
    // this.messages.push({ type: "delete", text: "testing testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting", icon: this.iconClass.get("delete") })
    // this.messages.push({ type: "error", text: "testing", icon: this.iconClass.get("error") })
  }


  addMessage(action: string, msg: string) {
    this.messages.push({ type: action, text: msg, icon: this.iconClass.get(action) });
    setTimeout(() => this.messages.shift(), this.timeout);
  }

}
