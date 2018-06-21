import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../../services/auth.service';
import { TaskService } from '../../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-assignment-tasks',
  templateUrl: './assignment-tasks.component.html',
  styleUrls: ['./assignment-tasks.component.css']
})
export class AssignmentTasksComponent implements OnInit {
 
  user: User;

  assignment: Assignment;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private taskService: TaskService,
              private globalService: GlobalService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.route.params.subscribe(params => {
        let assignmentId = params['id'];
        let assignmentRef = this.afs.doc<Assignment>("users/" + user.uid + "/assignments/" + assignmentId);
        assignmentRef.
        assignmentRef.valueChanges().subscribe(a => this.assignment = a);
      });
    });
  }


  testXY(elementId: string) : void {
    console.log("x: " + window.document.getElementById(elementId).offsetLeft);
    console.log("y: " + window.document.getElementById(elementId).offsetTop);
  }

}
