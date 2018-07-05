import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';


import { TaskCategory, Status } from '../../interfaces/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
 
  user: User;

  taskCategories: TaskCategory[];

  // statuses: Status[] = new Array<Status>([{ index: 0, name: "not started" }, { index: 1, name: "in progress" }, { index: 2, name: "completed" }]);

  // statusMap: Map<number, string> = new Map([ // not used
  //   [ 0, "not started" ],
  //   [ 1, "in progress" ],
  //   [ 2, "completed" ]
  // ]);

  prioText: string[] = ["disabled", "low", "medium", "high", "critical"];

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private taskService: TaskService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if(user) {
        let taskCatRef: AngularFirestoreCollection<TaskCategory> = this.afs.collection<TaskCategory>('users/' + user.uid + '/taskCategories/');//, ref => ref.orderBy("collapsed"));
        taskCatRef.valueChanges().subscribe(cats => {
          this.taskCategories = cats;
        });
      }
    });
  }

  // ngOnDestroy() {
  //   for(let cat of this.taskCategories) {
  //     this.taskService.saveCollapsedCategoryState(cat.name, cat.collapsed); // only saves states if you navigate to a different page on the website 
  //   }
  // }

  testXY(elementId: string) {
    console.log("x: " + window.document.getElementById(elementId).offsetLeft);
    console.log("y: " + window.document.getElementById(elementId).offsetTop);
  }

}
