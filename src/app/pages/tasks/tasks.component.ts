import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';


import { TaskCategory } from '../../interfaces/task';
import { GlobalService } from '../../services/global.service';

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
              public taskService: TaskService,
              public globalService: GlobalService
              ) { }

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

}
