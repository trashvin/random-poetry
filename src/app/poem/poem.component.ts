import { Component, OnInit, ChangeDetectorRef, OnDestroy, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/Rx";
import { Router, ActivatedRoute } from "@angular/router";

import { StitchService, StorageService } from "../_shared/services/service";
import { Logger } from "../_shared/libraries/logger";
import { Poem } from "../_shared/models/poem";
import { AppConstants } from "../app.constant";
import { AppComponent } from "../app.component";

declare var $: any;

@Component({
  selector: "app-poem",
  templateUrl: "./poem.component.html",
  styleUrls: ["./poem.component.css"]
})
export class PoemComponent implements OnInit, OnDestroy {
  private log = new Logger("Poem", "Component");
  display = "none";
  subscriber: Subscription;
  likes: number;
  increased = 0;
  _id: any;
  poem: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  shares = 0;
  own_poem = true;
  filter_tags= this.storage.filter_tags;
  like_subject = new Subject<number>();
  observable_likes = this.like_subject.asObservable().debounceTime(1000);
  implemented = false;
  // observable_likes  = this.like_subject.debounceTime(1000)
  constructor(
    private change_detector: ChangeDetectorRef,
    private stitch: StitchService,
   private router: Router,
    private constant: AppConstants,
    public storage: StorageService,
    private renderer: Renderer2
  ) {
  }
  ngOnInit() {
    this.log.i("Poem Component init");
    this.stitch.getRandomPoem(null);
    this.log.l("Subscribing...");
    this.subscriber = this.stitch.observable_random_poem.subscribe(res => {
      this.log.raw(res);
      try {
        if (res !== null) {
        this._id = res._id;
        this.title = res.title;
        this.poem = res.poem;
        this.author = res.author;
        this.date = res.date_submitted !== undefined ? res.date_submitted.toDateString() : "Sometime Ago";
        this.tags = res.tags;
        this.likes = res.likes !== undefined ? res.likes : 0;
        this.shares = res.shares !== undefined ? res.shares : 0;
        this.own_poem = res.own_poem;
        } else {
          this.log.w("Result is null");
        }
      } catch (err) {
        this.log.e(err);
      }
    });
    this.observable_likes.subscribe(res => {
      this.log.l(res);
      this.updateHeart();
    });
    if ( this._id === null) {
      this.log.l("try..");
      this.stitch.getRandomPoem(null);
    }
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
    this.stitch.getRandomPoem(this._id);
  }
  onHeart() {
    this.increased += 1;
    this.likes += 1;
    // this.like_subject.debounceTime(1000);
    this.like_subject.next(this.increased);
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
    count["likes"] = this.increased;
    this.increased = 0;
    this.stitch.updateLikes(this._id, count).then(result => {
      this.log.raw(result);
    });
  }
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  onAdd() {
    this.storage.current_action = this.constant.action_add;
    this.router.navigate(["details"]);
  }
  onAbout() {
    this.router.navigate(["about"]);
  }
  onHome() {
    this.router.navigate(["poem"]);
  }
  onCustom() {
    // $(#randomConfig).modal("show");
    this.display = "block";
    // this.dialog.nativeElement.modal("show");
  }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
  setFilterTags() {
    this.display = "none";
    this.storage.filter_tags = this.filter_tags;
    this.stitch.getRandomPoem(null);
  }
  clearFilters() {
    this.filter_tags = "";
    // this.storage.filter_tags = "";
  }
  onCancel() {
    this.display = "none";
  }
  onProfile() {
    this.router.navigate(["user"]);
  }
  onLogin() {
    // logout current user
    try {
      this.stitch.doLogout().then( res => {
        this.log.l(res);
        this.storage.is_anonymous = false;
        this.router.navigate(["user"]);
      }).catch( err => this.log.w(err));
    } catch (err) {
      this.router.navigate(["user"]);
    } 
  }
  onLogout() {
    if (this.storage.is_logged_in) {
      this.stitch.doLogout().then(() => {
        this.storage.is_logged_in = false;
        this.storage.clear();
        this.storage.is_anonymous = false;
        this.router.navigate(["/"]);
      }). catch( err => {
        this.log.l("Failed logout");
        this.log.e(err);
      });
    } else {
      this.stitch.doLoginAnonymous().then( res => {
        this.log.l(res);
        this.stitch.doLogout().then(() => {
          this.storage.is_logged_in = false;
          this.storage.clear();
          this.storage.is_anonymous = false;
          this.router.navigate(["/"]);
        }). catch( err => {
          this.log.l("Failed logout");
          this.log.e(err);
        });
      });
    }
  }

}
