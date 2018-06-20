import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
 
  user: User;

  taskCategories: TaskCategory[];
  // tasks: Task[];
  tasksInProgress: Task[] = new Array<Task>();
  completedTasks: Task[] = new Array<Task>();

  // deleteConfirmation: boolean;
  // deleteId: number;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private taskService: TaskService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user
      let taskCatRef = this.afs.collection<TaskCategory>('users/' + user.uid + '/taskCategories/');
      taskCatRef.valueChanges().subscribe(cats => {
        this.taskCategories = cats;
        for(let cat of cats) {
          if(cat.tasks) {
            for(let task of cat.tasks) {
              if(task.status == "in progress")
                this.tasksInProgress.push(task);
              else if(task.status == "completed")
                this.completedTasks.push(task)
            }
          }
        }
      });
      // tasksCatRef.collection('').valueChanges().subscribe(tasks => this.tasks = tasks)
    });
  }

  getTasksNotStarted(tasks: Task[]): Task[] {
    let newTasks: Task[] = new Array<Task>();
    for(let task of tasks) {
      if (task.status == "not started")
        newTasks.push(task);
    }
    return newTasks;
  }


  // showDeleteConfirmation(id: number) {
  //   this.deleteId = id;
  //   this.deleteConfirmation = true;
  // }

}
