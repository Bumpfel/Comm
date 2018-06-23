import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';


import { TaskCategory } from '../../interfaces/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
 
  user: User;

  taskCategories: TaskCategory[];

  prioText: string[] = ["disabled", "low", "medium", "high", "critical"];

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private taskService: TaskService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user
      let taskCatRef = this.afs.collection<TaskCategory>('users/' + user.uid + '/taskCategories/');
      taskCatRef.valueChanges().subscribe(cats => {
        this.taskCategories = cats;
      });
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
