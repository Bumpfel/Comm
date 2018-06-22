import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { MessageService } from './message.service';

import { Task, TaskCategory, MultiDate } from '../interfaces/task';

@Injectable()
export class TaskService {

  user: User;

  taskCategories: TaskCategory[];
  tasks: Task[];
  categsRef: AngularFirestoreCollection<TaskCategory>;

  actionInProgress: boolean;
  newCategoryPopup: boolean;
  deleteCategoryPopup: boolean;
  newTaskPopup: boolean;
  editTaskPopup: boolean;
  deleteTaskPopup: boolean;


  // activeTask: Task;


  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private globalService: GlobalService,
    private messageService: MessageService) {

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.categsRef = this.afs.collection<TaskCategory>("users/" + user.uid + "/taskCategories/");
      this.categsRef.valueChanges().subscribe(cats => this.taskCategories = cats);
    });
  }

  filterAndSortTasksByStatus(tasks: Task[], status: string): Task[] {
    let newTasks: Task[] = new Array<Task>();
    if (tasks) {
      for (let task of tasks) {
        if (task.status == status)
          newTasks.push(task);
      }
      if (status == "not started") {
        newTasks.sort((a, b) => {
          if (a.priority < b.priority)
            return 1;
          // else if(a.priority > b.priority)
          return -1;
          // else
          //   return b.id - a.id; // secondary sorting - points
        });
      }
      else if (status == "in progress") {
        newTasks.sort((a, b) => {
          if (a.startedAt < b.startedAt)
            return 1;
          return -1;
        });
      }
      else if (status == "completed") {
        newTasks.sort((a, b) => {
          if (a.completedAt < b.completedAt)
            return 1;
          return -1;
        });
      }
    }
    return newTasks;
  }


  //--------------------------- Category functions -------------------------------//

  newCategory(name: string): void {
    this.actionInProgress = true;
    let trimmedName = name.trim();
    if (trimmedName.length > 0) {
      // let taskColRef = this.authService.userDocRef.collection('/taskCategories/')
      // taskColRef.add({ 'id': '-1', 'name': trimmedName })
      let taskDocRef: AngularFirestoreDocument<TaskCategory> = this.afs.doc("users/" + this.user.uid + "/taskCategories/" + trimmedName.toLowerCase())
      taskDocRef.set({ "name": trimmedName, "name_key": trimmedName.toLowerCase(), "tasks": [] }) //, 'nextTaskId': 0 })
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

  deleteCategory(category: TaskCategory) {
    this.actionInProgress = true;
    if (category.tasks && category.tasks.length > 0) {
      this.closePopups();
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Cannot delete category. Category is not empty")
    }
    else {
      this.categsRef.doc(category.name.toLowerCase()).delete()
        .then(() => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("delete", "Category deleted");
        });
    }
  }

  collapseCategory(name: string, collapsedState: boolean) {
    this.categsRef.doc(name.toLowerCase()).update({ 'collapsed': collapsedState });
  }

  //-------------------------------- Task functions ------------------------------//

  newTask(category_key: string, newName: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.actionInProgress = true;
    let catRef = this.categsRef.doc(category_key);
    // ref.valueChanges().subscribe(category => {
    for (let category of this.taskCategories) { // bad solution
      if (category.name_key == category_key) {
        let tasks: Task[] = category.tasks;
        if (tasks == undefined)
          tasks = new Array<Task>();
        if (!this.user.nextTaskId)
          this.user.nextTaskId = 0;
        tasks.push({ 'id': this.user.nextTaskId, 'name': newName, 'description': newDescription, 'points': newPoints, 'priority': newPriority, 'status': 'not started' });
        catRef.update({ 'tasks': tasks }) //, 'nextTaskId': category.nextTaskId + 1 })
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

  editTask(currentCategory: TaskCategory, destinationCategory: TaskCategory, task: Task, newName: string, newDescription: string, newPoints: number, newPriority: number): void {
    console.log(currentCategory);
    console.log(destinationCategory);

    this.actionInProgress = true;
    let key: string = currentCategory.name.toLowerCase();
    let docRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc(key);
    // for (let category of this.taskCategories) { // bad solution. try using find instead.
    //   if (category.name_key == category_key) {
    let category: TaskCategory = this.taskCategories.find(category => key == category.name.toLowerCase());
    let tasks: Task[] = category.tasks;
    // let task = tasks.find(task => id == task.id);
    task.name = newName;
    task.description = newDescription;
    task.points = newPoints;
    task.priority = newPriority;
    task.editedAt = this.globalService.getTimeStamp();

    if (currentCategory != destinationCategory) {
      let newDocRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc(destinationCategory.name.toLowerCase());
      let taskIndex = tasks.findIndex(t => t.id == task.id);
      // this.taskCategories.find(cat => cat.name == destinationCategory.name)
      if(!destinationCategory.tasks)
        destinationCategory.tasks = new Array<Task>();
      destinationCategory.tasks.push(task);
      newDocRef.update({ 'tasks': destinationCategory.tasks });
      // this.newTask(destinationCategory.name.toLowerCase(), destinationCategory.name, task.description, task.points, task.priority);
      tasks.splice(taskIndex, 1);

    }
    docRef.update({ 'tasks': tasks })
    .then(() => {
      // if()
      this.closePopups();
      this.actionInProgress = false;
      this.messageService.addMessage("update", "Task edited");
    });
  }

  deleteTask(category_key: string, id: number) {
    this.actionInProgress = true;
    let ref = this.categsRef.doc<TaskCategory>(category_key);
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
    let ref = this.categsRef.doc<TaskCategory>(category_key);
    let tasks: Task[] = this.taskCategories.find(cat => cat.name_key == category_key).tasks
    let task: Task = tasks.find(task => task.id == id);
    task.status = newStatus;
    if (task.status == "not started") {
      task.startedAt = null;
      task.completedAt = null;
    }
    else if (task.status == "in progress") {
      if (task.startedAt == null)
        task.startedAt = this.globalService.getTimeStamp();
      task.completedAt = null;
    }
    else if (task.status == "completed")
      task.completedAt = this.globalService.getTimeStamp();
    ref.update({ 'tasks': tasks })//.then(() => console.log("changed status"));
  }


  //----------------------- Popup functions ----------------------------//

  showNewCategoryPopup() {
    this.closePopups();
    this.newCategoryPopup = true;
  }

  showDeleteCategoryPopup() {
    this.closePopups();
    this.deleteCategoryPopup = true;
  }

  showNewTaskPopup() {
    this.closePopups();
    this.newTaskPopup = true;
  }

  showEditTaskPopup() {
    this.closePopups();
    this.editTaskPopup = true;
  }

  showDeleteTaskPopup() {
    this.closePopups();
    this.deleteTaskPopup = true;
  }

  closePopups() {
    this.newCategoryPopup = false;
    this.deleteCategoryPopup = false;
    this.newTaskPopup = false;
    this.editTaskPopup = false;
    this.deleteTaskPopup = false;
  }

}
