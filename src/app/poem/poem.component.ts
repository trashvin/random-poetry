import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/Rx";

import { SessionService, StitchService } from "../_shared/services/service";
import { Logger } from "../_shared/libraries/logger";
import { Poem } from "../_shared/models/poem";
import { collectExternalReferences } from "@angular/compiler/src/output/output_ast";
@Component({
  selector: "app-poem",
  templateUrl: "./poem.component.html",
  styleUrls: ["./poem.component.css"]
})
export class PoemComponent implements OnInit, OnDestroy {
  private log = new Logger("Poem", "Component");
  subscriber: Subscription;
  likes: number;
  _id: any;
  poem: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  like_subject = new Subject<number>();
  observable_likes  = this.like_subject.asObservable().debounceTime(1000);
  // observable_likes  = this.like_subject.debounceTime(1000)
  constructor(
    private change_detector: ChangeDetectorRef,
    private stitch: StitchService,
    public session: SessionService
  ) {
  }
  ngOnInit() {
    this.log.i("Poem Component init");
    this.stitch.getRandomPoem();
    this.log.l("Subscribing...");
    this.subscriber = this.stitch.observable_random_poem.subscribe(res => {
      this.log.raw(res);
      try {
        this._id = res._id;
        this.title = res.title;
        this.poem = res.poem;
        this.author = res.author;
        this.date = res.date_submitted !== undefined ? res.date_submitted.toDateString() : "Sometime Ago";
        this.tags = this.toArrayOfTags(res.tags);
        this.likes = res.likes !== undefined ? res.likes : 0 ;
      } catch (err) {
        this.log.e(err);
      }
    });
    this.observable_likes.subscribe( res => {
      this.log.l(res);
      this.updateHeart();
    });
  }
  toArrayOfTags(tags: string) {
    let temp = [];
    if (tags !== undefined) {
      temp = tags.split(";");
    }
    this.log.l(temp);
    temp = temp.filter(word => word !== "");
    this.log.l(temp);
    return temp;
  }
onNext() {
  this.stitch.getRandomPoem();
}
onHeart() {
  this.likes += 1;
  // this.like_subject.debounceTime(1000);
  this.like_subject.next(this.likes);
  // this.log.l(this.likes);
  // this.updateHeart();
  // this.debounce(this.updateHeart, 250);
  // this.debounce(function(){
  //   this.log.i("Debounced...");
  //   const count = {};
  //   count["likes"] = this.likes;
  //   this.stitch.updatePoem(this._id, count);
  // }, 2, false);
}
updateHeart() {
  this.log.l("Updating hearts...");
  const count = {};
  count["likes"] = this.likes;
  this.stitch.updatePoem(this._id, count);
}
debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
ngOnDestroy(): void {
  this.subscriber.unsubscribe();
}

}
