import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
// import { GlobalService } from './global.service';
import { MessageService } from './message.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TaskService {

  user: User;

  assignment: Assignment;
  tasks: Task[];
  assignRef: AngularFirestoreDocument<Assignment>;

  actionInProgress: boolean;
  categoryPopup: boolean;
  newTaskPopup: boolean;
  editTaskPopup: boolean;

  // activeTask: Task;

  showDeleteConfirmation: boolean;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              // private globalService: GlobalService,
              private messageService: MessageService,
              private route: ActivatedRoute) {

    this.authService.user$.subscribe(user => {
      this.user = user;
        // this.assignRef = this.afs.doc<Assignment>("users/" + user.uid + "/assignments/" + assignmentId + "/");
        // this.assignRef.valueChanges().subscribe(assignment => {
        //   this.assignment = assignment;
          // console.log(assignment.name);
      // });
    });
  }

  filterTasksByStatus(tasks: Task[], status: string): Task[] {
    let newTasks: Task[] = new Array<Task>();
    if(tasks) {
      for(let task of tasks) {
        if (task.status == status)
        newTasks.push(task);
      }
    }
    return newTasks;
  }

  newCategory(assignment: Assignment, name: string): void {
    this.actionInProgress = true;
    let trimmedName = name.trim();
    if (trimmedName.length > 0) {
      // let taskColRef = this.authService.userDocRef.collection('/taskCategories/')
      // taskColRef.add({ 'id': '-1', 'name': trimmedName })
      let ref: AngularFirestoreDocument<any> = this.afs.doc("users/" + this.user.uid + "/assignments/" + assignment.name.toLowerCase() + "/" + trimmedName.toLowerCase() + "/_temp")
      ref.set({ }) //, 'nextTaskId': 0 })
        .then((ref) => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("add", "Category added");
          // taskColRef.doc(ref.id).update({ 'id': ref.id });
        });
    }
    else {
      this.messageService.addMessage("error", "Category name mustn't be empty");
    }
  }

  newTask(category_key: string, newName: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.actionInProgress = true;
    let ref = this.assignRef.doc(category_key);
    // ref.valueChanges().subscribe(category => {
    for (let category of this.taskCategories) { // bad solution
      if (category.name_key == category_key) {
        let tasks: Task[] = category.tasks;
        if (tasks == undefined)
          tasks = new Array<Task>();
        if (!this.user.nextTaskId)
          this.user.nextTaskId = 0;
        tasks.push({ 'id': this.user.nextTaskId, 'name': newName, 'description': newDescription, 'points': newPoints, 'priority': newPriority, 'status': 'not started' });
        ref.update({ 'tasks': tasks }) //, 'nextTaskId': category.nextTaskId + 1 })
          .then(() => {
            this.afs.doc("users/" + this.user.uid).update({ 'nextTaskId': (this.user.nextTaskId + 1) })
            this.closePopups();
            this.actionInProgress = false;
            this.messageService.addMessage("add", "Task created");
          });
        break;
      }
    };
  }

  editTask(category_key: string, id: number, newName: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.actionInProgress = true;
    let ref = this.assignRef.doc(category_key);
    // for (let category of this.taskCategories) { // bad solution. try using find instead.
    //   if (category.name_key == category_key) {
    let category: TaskCategory = this.taskCategories.find(category => category_key == category.name_key);
    let tasks: Task[] = category.tasks;
    let task = tasks.find(task => id == task.id);
    task.name = newName;
    task.description = newDescription;
    task.points = newPoints;
    task.priority = newPriority;
    // if(!task.editedDate)
    //   task.editedDate = new Array<any>();
    // task.editedDate.push(new Date());

    ref.update({ 'tasks': tasks })
      .then(() => {
        this.closePopups();
        this.actionInProgress = false;
        this.messageService.addMessage("update", "Task edited");
      });
  }

  deleteTask(category_key: string, id: number) {
    this.actionInProgress = true;
    let ref = this.assignRef.doc<TaskCategory>(category_key);
    ref.valueChanges().subscribe(cat => {
      for (let i = 0; i < cat.tasks.length; i++) {
        if (cat.tasks[i].id == id) {
          cat.tasks.splice(i, 1);
          ref.update({ 'tasks': cat.tasks })
          .then(() => {
            this.closePopups();
            this.actionInProgress = false;
              this.messageService.addMessage("delete", "Task deleted");
            });
          break;
        }
      }
    });
  }

  changeTaskStatus(category_key: string, id: number, newStatus: string) {
    let ref = this.assignRef.doc<TaskCategory>(category_key);
    // ref.valueChanges().subscribe(cat => {
      let tasks: Task[] = this.taskCategories.find(cat => cat.name_key == category_key).tasks
      let task: Task = tasks.find(task => task.id == id);
      task.status = newStatus;
      ref.update({ 'tasks': tasks })//.then(() => console.log("changed status"));
  }

  showCategoryPopup() {
    this.closePopups();
    this.categoryPopup = true;
  }

  showNewTaskPopup(task?: Task) {
    this.closePopups();
    this.newTaskPopup = true;
  }

  showEditTaskPopup(task?: Task) {
    this.closePopups();
    this.editTaskPopup = true;
  }

  closePopups() {
    this.categoryPopup = false;
    this.newTaskPopup = false;
    this.editTaskPopup = false;
    this.showDeleteConfirmation = false;
  }

}
