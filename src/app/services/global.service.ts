import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalService {

  constructor(private afs: AngularFirestore) { }

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

  getTimeStamp(): string {
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
    return formattedDate;
  }
}
