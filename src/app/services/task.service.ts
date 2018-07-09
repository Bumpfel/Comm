import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { MessageService } from './message.service';

import { Task, TaskCategory } from '../interfaces/task';

@Injectable()
export class TaskService {

  user: User;

  taskCategories: TaskCategory[];
  tasks: Task[];
  categsRef: AngularFirestoreCollection<TaskCategory>;

  actionInProgress: boolean;
  newCategoryPopup: boolean;
  editCategoryPopup: boolean;
  deleteCategoryPopup: boolean;
  newTaskPopup: boolean;
  editTaskPopup: boolean;
  deleteTaskPopup: boolean;
  // changeCategory: boolean;

  popupTop: number;
  popupLeft: number;
  promptTop: number;
  promptLeft: number;

  statusBlocks: string[] = ["not started", "in progress", "completed"];

  // showEditCategory: boolean;
  pendingDeletion: string;

  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private globalService: GlobalService,
    private messageService: MessageService) {

    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.categsRef = this.afs.collection<TaskCategory>("users/" + user.uid + "/taskCategories/");
        this.categsRef.valueChanges().subscribe(cats => this.taskCategories = cats);
      }
    });

    window.onkeydown = (event) => {
      if (event.keyCode == 27 && !this.actionInProgress) /// esc key
        this.closePopups();
    }
  }

  filterByStatusAndSort(tasks: Task[], status: string): Task[] {
    let newTasks: Task[] = tasks.filter(task => task.status == status);

    if (status == "not started") {
      newTasks.sort((a, b) => {
        if (a.priority < b.priority)
          return 1;
        else if (a.priority > b.priority)
          return -1;
        else
          return b.id - a.id; // secondary sorting
      });
    }
    else if (status == "in progress") {
      newTasks.sort((a, b) => {
        if (a.startedAt < b.startedAt)
          return 1;
        return -1;
      });
      newTasks.sort((a, b) => {
        if (a.priority == 0 && a.priority < b.priority)
          return 1;
      });
    }
    else if (status == "completed") {
      newTasks.sort((a, b) => {
        if (a.completedAt < b.completedAt)
          return 1;
        return -1;
      });
    }
    return newTasks;
  }

  activeTasksCounter(tasks: Task[]): string {
    let nrNotStarted: number = 0, nrInProgress: number = 0, nrCompleted: number = 0;
    for(let task of tasks) {
      switch(task.status) {
        case "not started": nrNotStarted ++; break;
        case "in progress": nrInProgress ++; break;
        case "completed": nrCompleted ++; break;
      }
    }
    // return category.tasks.filter(task => task.status != "completed").length;
    return nrNotStarted + "+" + nrInProgress + "+" + nrCompleted;
  }

  getTasksInStatusBlock(tasks: Task[], status): number {
    return tasks.filter(tasks => tasks.status == status).length;
  }

  setActionTimeOut(closePopups: boolean, time?: number) {
    this.actionInProgress = true;
    let defaultTime: number = 5000;

    setTimeout(() => { 
      if(this.actionInProgress)
        this.messageService.addMessage("error", "Error: Action timed out");
        this.actionInProgress = false;
        closePopups ? this.closePopups() : '';
    }, time > defaultTime ? time : defaultTime);
  }

  //--------------------------- Category functions -------------------------------//

  newCategory(name: string): void {
    this.setActionTimeOut(false);
    
    let trimmedName = name.trim();
    if (trimmedName.length > 0) {
      if (this.isUniqueCategoryName(trimmedName)) {
        let taskDocRef: AngularFirestoreDocument<TaskCategory> = this.afs.doc<TaskCategory>("users/" + this.user.uid + "/taskCategories/" + trimmedName.toLowerCase());
        taskDocRef.set({ "name": trimmedName, "tasks": [], collapsed: false })
          .then(() => {
            this.closePopups();
            this.actionInProgress = false;
            this.messageService.addMessage("add", "Category added");
          })
          .catch(() => {
            this.actionInProgress = false;
            this.messageService.addMessage("error", "Error creating category. Please try again later");
          });
      }
      else {
        this.actionInProgress = false;
        this.messageService.addMessage("error", "There are already a category by that name");
      }
    }
    else {
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Category name mustn't be empty");
    }
  }

  deleteCategory(category: TaskCategory): void {
    this.setActionTimeOut(true);

    if (category.tasks.length > 0) { // Should not normally get here
      this.closePopups();
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Cannot delete category. Category is not empty");
    }
    else {
      this.categsRef.doc<TaskCategory>(category.name.toLowerCase()).delete()
        .then(() => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("delete", "Category deleted");
        })
        .catch(() => {
          this.actionInProgress = false;
          this.messageService.addMessage("error", "Error deleting category. Please try again later");
        });
    }
  }

  // Not used
  editCategory(category: TaskCategory, newName: string): void {
    this.pendingDeletion = category.name;
    this.setActionTimeOut(false);

    let trimmedName = newName.trim();
    if (trimmedName.length > 0) {
      if (category.name.toLowerCase() != trimmedName.toLowerCase()) {
        if (this.isUniqueCategoryName(trimmedName)) {
          this.categsRef.doc<TaskCategory>(trimmedName.toLowerCase()).set({ 'name': trimmedName, 'tasks': category.tasks, 'collapsed': category.collapsed })
            .then(() => {
              this.categsRef.doc(category.name.toLowerCase()).delete()//.then(() => console.log(category.name + " deleted"));
                .catch((error) => {
                  console.log("Error deleting old category");
                })
              this.closePopups();
              this.actionInProgress = false;
              this.pendingDeletion = undefined;
              this.messageService.addMessage("update", "Category edited");
            })
            .catch(() => {
              this.actionInProgress = false;
              this.pendingDeletion = undefined;
              this.messageService.addMessage("error", "Error editing category. Please try again later")
            });
          }
          else {
            this.actionInProgress = false;
            this.pendingDeletion = undefined;
          this.messageService.addMessage("error", "There are already a category by that name");
        }
      }
      else {
        this.actionInProgress = false;
        this.pendingDeletion = undefined;
        console.log("no changes was made");
      }
    }
    else {
      this.actionInProgress = false;
      this.pendingDeletion = undefined;
      this.messageService.addMessage("error", "Category name mustn't be empty");
    }
  }

  saveCollapsedCategoryState(name: string, collapsedState: boolean): void { // was used for only saving on ngOnDestroy (function name made more sense). using the other one atm. 
    this.categsRef.doc<TaskCategory>(name.toLowerCase()).update({ 'collapsed': collapsedState });
  }

  collapseCategory(name: string, collapsed: boolean): void { // Duplicate
    this.categsRef.doc<TaskCategory>(name.toLowerCase()).update({ 'collapsed': collapsed })
      // .then(() => {
      //   if (collapsed == false)
      //     document.getElementById(name).scrollIntoView({ behavior: "smooth", block: "nearest" });
      // });
  }

  isUniqueCategoryName(newName: string): boolean {
    return this.taskCategories.findIndex(category => category.name.toLowerCase() == newName.toLowerCase()) == -1;
  }

  //-------------------------------- Task functions ------------------------------//

  newTask(category: TaskCategory, newSubject: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.setActionTimeOut(false);
        
    let trimmedSubject = newSubject.trim();
    if (trimmedSubject.length > 0) {
      let catRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
      // let tasks: Task[] = Object.assign({}, category.tasks);
      if (!this.user.nextTaskId)
        this.user.nextTaskId = 0;

      category.tasks.push({ 'id': this.user.nextTaskId, 'subject': trimmedSubject, 'description': newDescription, 'points': newPoints, 'priority': newPriority, 'status': 'not started' });
      catRef.update({ 'tasks': category.tasks })
        .then(() => {
          this.afs.doc("users/" + this.user.uid).update({ 'nextTaskId': (this.user.nextTaskId + 1) })
            .catch(() => {
              console.log("Error updating nextTaskId");
            });
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("add", "Task created");
        })
        .catch(() => {
          this.actionInProgress = false;
          this.messageService.addMessage("error", "Error creating task. Please try again later");
          // console.log(error);
        });
    }
    else {
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Subject mustn't be empty")
    }
  }

  editTask(currentCategory: TaskCategory, destinationCategory: TaskCategory, taskId: number, newSubject: string, newDescription: string, newPoints: number, newPriority: number): void {
    this.setActionTimeOut(false);
    
    let trimmedSubject = newSubject.trim();
    if (trimmedSubject.length > 0) {
      let docRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc(currentCategory.name.toLowerCase());
      let taskIndex = currentCategory.tasks.findIndex(task => task.id == taskId);
      let task = currentCategory.tasks[taskIndex]; //bad practice to modify parameter
      task.subject = newSubject;
      task.description = newDescription;
      task.points = newPoints;
      task.priority = newPriority;
      task.editedAt = this.globalService.getTimeStamp();

      if (currentCategory != destinationCategory) {
        let newDocRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc<TaskCategory>(destinationCategory.name.toLowerCase());
        destinationCategory.tasks.push(task);
        newDocRef.update({ 'tasks': destinationCategory.tasks });
        currentCategory.tasks.splice(taskIndex, 1);
      }
      docRef.update({ 'tasks': currentCategory.tasks })
        .then(() => {
          this.closePopups();
          this.actionInProgress = false;
          this.messageService.addMessage("update", "Task edited");
        })
        .catch(() => {
          this.actionInProgress = false;
          this.messageService.addMessage("error", "Error saving details. Please try again later");
        });
    }
    else {
      this.actionInProgress = false;
      this.messageService.addMessage("error", "Subject mustn't be empty")
    }
  }

  deleteTask(category: TaskCategory, taskId: number): void {
    this.setActionTimeOut(false);
    
    let docRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
    let taskIndex: number = category.tasks.findIndex(task => task.id == taskId);
    category.tasks.splice(taskIndex, 1); // bad practice to modify parameter, but cba to copy array
    // docRef.update({ 'tasks': category.tasks })
    //   .then(() => {
    //     this.closePopups();
    //     this.actionInProgress = false;
    //     this.messageService.addMessage("delete", "Task deleted");
    //   })
    //   .catch(() => {
    //     this.actionInProgress = false;
    //     this.messageService.addMessage("error", "Error deleting task. Please try again later");
    //   });
  }

  changeTaskStatus(category: TaskCategory, taskId: number, change: number): void {
    let docRef: AngularFirestoreDocument<TaskCategory> = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
    let task: Task = category.tasks.find(task => task.id == taskId);
    let statusIndex: number = this.statusBlocks.findIndex(status => status == task.status);
    task.status = this.statusBlocks[statusIndex + change]; // bad practice
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

    docRef.update({ 'tasks': category.tasks })
      // .then(() => console.log("changed status"));
      .catch(() => this.messageService.addMessage("error", "An error occurred. Please try again later"));
  }


  //----------------------- Popup functions ----------------------------//

  showNewCategoryPopup(el: HTMLElement): void {
    this.closePopups();
    this.globalService.setFocus('newCategoryName');
    this.newCategoryPopup = true;
    this.popupTop = el.offsetTop;
    this.popupLeft = el.offsetLeft;
  }

  // Not used
  showEditCategoryPopup(el: HTMLElement): void {
    this.closePopups();
    this.editCategoryPopup = true;
  }

  showDeleteCategoryPopup(el: HTMLElement): void {
    this.closePopups();
    this.deleteCategoryPopup = true;
    this.popupTop = el.offsetTop;
    this.popupLeft = el.offsetLeft;
  }

  showNewTaskPopup(el: HTMLElement): void {
    this.closePopups();
    this.globalService.setFocus('newTaskSubject');
    this.newTaskPopup = true;
    this.popupTop = el.offsetTop;
    this.popupLeft = el.offsetLeft;
  }

  showEditTaskPopup(el: HTMLElement): void {
    this.closePopups();
    this.globalService.setFocus('editTaskSubject');
    this.editTaskPopup = true;
    this.popupTop = el.offsetTop - el.parentElement.scrollTop;
    this.popupLeft = el.offsetLeft;
  }

  showDeleteTaskPopup(el: HTMLElement): void {
    this.deleteTaskPopup = true;
    this.promptTop = el.offsetTop + el.offsetHeight - 175;
    this.promptLeft = el.offsetLeft - 25;
    // console.log();
  }

  closePopups(): void {
    // console.log(this.activeParentElement.offsetTop + ", " + this.activeParentElement.offsetLeft)
    // this.activeParentElement = undefined;
    this.newCategoryPopup = undefined;
    this.editCategoryPopup = undefined;
    this.deleteCategoryPopup = undefined;
    this.newTaskPopup = undefined;
    this.editTaskPopup = undefined;
    this.deleteTaskPopup = undefined;
    // this.changeCategory = undefined;
  }


  //------------------------ Temporary fix functions ----------------------//

  // fixDeleteNameFromTasks() {
  //   for(let category of this.taskCategories) {
  //     for(let task of category.tasks) {
  //       delete task.name;
  //     }

  //     this.categsRef.doc<TaskCategory>(category.name.toLowerCase()).update({ tasks: category.tasks })
  //       .then(() => this.messageService.addMessage("update", "task names has been removed from category " + category.name));
  //   }
  // }  

  // fixSubject(category: TaskCategory) {
  //     for(let task of category.tasks) {
  //       task.subject = task.name;
  //     }
  //     this.categsRef.doc<TaskCategory>(category.name.toLowerCase()).update({ 'tasks': category.tasks });
  // }

  // fixPrio(category: TaskCategory, oldTask) { // a temporary script
  //   let docRef = this.categsRef.doc<TaskCategory>(category.name.toLowerCase());
  //   let task: Task = category.tasks.find(task => task.id == oldTask.id);

  //   if(oldTask.priority == "low")
  //     task.priority = 1;
  //   else if(oldTask.priority == "medium")
  //     task.priority = 2;
  //   if(oldTask.priority == "high")
  //     task.priority = 3;
  //   if(oldTask.priority == "critical")
  //     task.priority = 4;

  //     docRef.update({ 'tasks': category.tasks })
  //       .then(() => this.messageService.addMessage("update", "prio fixed for task " + task.name));
  // }

}
