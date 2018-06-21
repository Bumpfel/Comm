import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../../services/auth.service';
import { AssignmentService } from '../../../services/assignment.service';

@Component({
  selector: 'app-assignment-lobby',
  templateUrl: './assignment-lobby.component.html',
  styleUrls: ['./assignment-lobby.component.css']
})
export class AssignmentLobbyComponent implements OnInit {

  user: User;
  assignments: AssignmentCategory[];

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private assignmentService: AssignmentService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      let assignRef = this.afs.collection<AssignmentCategory>("users/" + user.uid + "/assignments/");
      assignRef.valueChanges().subscribe(a => this.assignments = a);
    });
  }

}
