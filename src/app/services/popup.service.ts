import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs/Observable';
import { PopupChoice } from '../interfaces/popupChoice';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()

export class PopupService {

  user: User;
  private actionInProgress: boolean;
  private action: Function;
  confirmationPrompt: boolean;
  confirmationPromptText: string;
  confirmationPromptText2: string;

  private popupChoice: PopupChoice;
  private oChoice: Observable<PopupChoice>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private globalService: GlobalService,
    // private messageService: MessageService
    ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    window.onkeydown = (event) => {
      if (event.keyCode == 27 && !this.actionInProgress) /// esc key
        this.closePopups();
    }
  }




// old stuff

  newConfirmationPromptCallback(text: string, text2: string, callback: Function) : void {
    this.closePopups();
    this.confirmationPrompt = true;
    this.confirmationPromptText = text;
    this.confirmationPromptText2 = text2;
    // this.action = callback;
  }
  
  newConfirmationPromptObservable(text: string, text2: string) : void {
    this.closePopups();
    this.confirmationPrompt = true;
    this.confirmationPromptText = text;
    this.confirmationPromptText2 = text2;
    this.popupChoice = new PopupChoice();
    this.popupChoice.answer = true;
    this.oChoice = new Observable(this.popupChoice);
  }


  setPromptAnswer(answer: boolean) {
    this.popupChoice.answer = answer;
  }

  // newCreateChannelPopup(text: string) : void {
  //   this.closePopups();
  //   this.createChannelPopup = text;
  //   // this.action = callback;
  // }

  executeAction(arg: string) {
    this.action.apply(arg);
    // this.closePopups();
  }

  private closePopups() {
    this.confirmationPrompt = false;
    // this.confirmationPromptText = undefined
    // this.confirmationPromptText2 = undefined
    this.action = undefined;
    // this.createChannelPopup = undefined;
  }

  testCallback(text: string) : void {
    console.log(text);
  }


}
