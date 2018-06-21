import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';

@Injectable()
export class AssignmentService {
  
  user: User;
  actionInProgress: boolean;
  newAssignmentPopup: boolean;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private messageService: MessageService) {
  
  this.authService.user$.subscribe(user => this.user = user);
  }

  newAssignment(name: string) {
    this.actionInProgress = true;
    let ref = this.afs.doc("users/" + this.user.uid + "/assignments/" + name.toLowerCase());
    ref.set({ 'name': name })
      .then(() => {
        this.actionInProgress = false;
        this.closePopups();
        this.messageService.addMessage("add", "Assignment created");
      });
  }



  showNewAssignmentPopup() {
    this.closePopups();
    this.newAssignmentPopup = true;
  }

  closePopups() {
    this.newAssignmentPopup = false;
  }

}
