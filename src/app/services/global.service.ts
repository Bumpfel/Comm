import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';
import { format } from 'url';

@Injectable()
export class GlobalService {

  constructor(private afs: AngularFirestore) { }
  
  setFocus(elementId) {
    setTimeout(() => { document.getElementById(elementId).focus() }, 0);
  }

  scrollTo(name: string) {
    setTimeout(() => {
      document.getElementById(name).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  }

  dragPopup(el: HTMLElement, event) {
    let xPos1, xPos2, yPos1, yPos2;
    xPos2 = event.clientX;
    yPos2 = event.clientY;
    document.onmousemove = startDrag;
    document.onmouseup = stopDrag;
    
    function startDrag(e) {
      e = e || window.event;
      e.preventDefault();
      xPos1 = xPos2 - e.clientX;
      yPos1 = yPos2 - e.clientY;
      xPos2 = e.clientX;
      yPos2 = e.clientY;
      el.style.top = (el.offsetTop - yPos1) + "px";
      el.style.left = (el.offsetLeft - xPos1)  + "px";
    }

    function stopDrag() {
      document.onmouseup = undefined;
      document.onmousemove = undefined;
    }
  }

  getRandomColour(colourRange: string): string {
    var str = "#";
    var possible = colourRange;

    for (var i = 0; i < 3; i++)
      str += possible.charAt(Math.floor(Math.random() * possible.length));

    return str;
  }

  isNotEmpty(name: string) {
    return name.trim().length > 0;
  }
  
  getData(): Observable<Global> {
    return this.afs.doc<Global>('data/global').valueChanges();
  }

  getTimeStamp2() { // Don't think this is used
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  printTime(time: string): string {
    return time.slice(11, 16);
  }

  getRandomInt(intervalStart: number, intervalEnd: number): number {
    return Math.floor(Math.random() * (intervalEnd - intervalStart)) + intervalStart;
  }

  getTimeStamp(): string {
    var date = new Date();
    let timeStamp = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      .map(current => current >= 10 ? current : "0" + current).join("-")
      + " " + [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map(current => current >= 10 ? current : "0" + current).join(":")
      + "." + [date.getMilliseconds()].map(current => current >= 100 ? current : (current >= 10 ? "0" + current : "00" + current));

    return timeStamp;
  }

  getTimeStampOld(): string {
    var date = new Date();
    var YY = date.getFullYear();

    var M = date.getMonth() + 1;
    var MM: string = "" + M;
    if (M < 10)
      MM = "0" + M;

    var D = date.getDate();
    var DD: string = "" + D;
    if (D < 10)
      DD = "0" + D;

    var h = date.getHours();
    var hh: string = "" + h;
    if (h < 10)
      hh = "0" + h;

    var m = date.getMinutes();
    var mm: string = "" + m;
    if (m < 10)
      mm = "0" + m;

    var s = date.getSeconds();
    var ss: string = "" + s;
    if (s < 10)
      ss = "0" + s;

    var ms = date.getMilliseconds();
    var mss: string = "" + ms;
    if (ms < 10)
      mss = "00" + ms;
    else if (ms < 100)
      mss = "0" + ms;

    var formattedDate = YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss + "." + mss;
    // console.log(formattedDate);
    return formattedDate;
  }

}


// @Injectable()
export class Timer {

  private startTime: number;
  private started: boolean;
  private lapNr: number = 0;
  printLog: boolean;

  constructor() {}

  start(): void {
    let d: Date = new Date();
    this.startTime = d.getTime();
    this.started = true;
    if(this.printLog)
      console.log("timer started");
  }

  lap(): void {
    if (this.started) {
      this.lapNr ++;
      if(this.printLog)
        console.log("lap: " + this.lapNr + ": " + this.getElapsedTime() + " ms elapsed");
    }
    else if(this.printLog)
      console.log("timer not started");
  }
  
  stop(): void {
    if (this.started) {
      if(this.printLog)
        console.log("timer stopped. " + this.getElapsedTime() + " ms elapsed");
      this.lapNr = 0;
      this.startTime = undefined;
      this.started = false;
    }
    else if(this.printLog)
      console.log("timer not started");
  }

  toggle(): void {
    if(!this.started) {
      this.start();
    }
    else {
      this.stop();
    }
  }

  toggleLog() {
    if(this.printLog)
      this.printLog = false;
    else
      this.printLog = true;
  }
  
  getElapsedTime(): number {
    let d: Date = new Date();
    return d.getTime() - this.startTime;
  }

  //--- for public access only
  isStarted(): boolean { 
    return this.started;
  }

  getLap(): number {
    return this.lapNr;
  }


}