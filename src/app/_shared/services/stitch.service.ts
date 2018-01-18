import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { environment } from "../../../environments/environment";
import { AlertService } from "./alert.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { Poem } from "../models/poem";
import { Logger } from "../libraries/logger";
import { PoemComponent } from "../../poem/poem.component";
import { AppConstants } from "../../app.constant";

declare var stitch: any;

@Injectable()
export class StitchService {
  private log = new Logger("Stitch", "Service");
  private client = new stitch.StitchClient(environment.stitch_app_id);
  private db: any;
  private poem_collection: any;
  private online = true;
  poem_subject: BehaviorSubject<Poem> = new BehaviorSubject<Poem>(null);
  random_poem_subject: BehaviorSubject<Poem> = new BehaviorSubject<Poem>(null);
  poems_subject: BehaviorSubject<Poem[]> = new BehaviorSubject<Poem[]>([]);
  observable_poems = this.poems_subject.asObservable();
  observable_poem = this.poem_subject.asObservable();
  observable_random_poem = this.random_poem_subject.asObservable();
  private poem_list = [];
  constructor(
    private storage: StorageService,
    private constant: AppConstants,
    private session: SessionService,
    private alert: AlertService
  ) {
    this.online = this.connect();
  }
  private connect() {
    this.log.functionName = "connect";
    if (this.client !== undefined) {
      this.db = this.client
        .service("mongodb", "mongodb-atlas")
        .db(environment.db_name);
      this.poem_collection = this.db.collection(environment.poem_collection);
      this.log.i("DB online");
      return true;
    } else {
      this.log.e("DB offline");
      return false;
    }
  }
  doLoginAnonymous() {
    this.storage.is_anonymous = true;
    // this.storage.is_logged_in = false;
    return this.client.login();
  }
  doLoginGoogle() {
    this.client.authenticate(this.constant.google_auth);
  }
  doLoginFB() {
    this.client.authenticate(this.constant.fb_auth);
  }
  doLogout() {
    return this.client.logout();
  }
  isAuthenticated(): boolean {
    this.log.functionName = "isAuthenticated";
    let result = false;
    // if ( this.storage.is_anonymous === false ) {
      try {
        this.log.l("Checking autheId");
        if ( this.storage.is_anonymous === false) {
          if (this.client.authedId() !== undefined && this.client.authedId() !== null) { // && this.storage.is_anonymous === false) {
            // check if not anonymous
              this.log.i("Authed Id:" + this.client.authedId());
              result = true;
            }
        } else {
          this.log.l("Anonymous user");
          result = false;
        }
      } catch (err) {
        this.log.w(err);
        return false;
      }
    // }
    this.log.l(`Result : ${result}`);
    return result;
  }
  getUserProfile() {
    this.log.functionName = "getUserProfile";
    this.log.i("Getting user profile");

    return this.client.userProfile()
      .then(result => result)
      .catch(err => {
        this.log.e(err);
        this.alert.sendMessage("Error fetching profile", this.constant.message_error);
      });
  }
  addPoem(new_poem: Poem) {
    this.log.functionName = "addPoem";
    this.log.i("Add new poem");
    this.log.raw(new_poem);
    new_poem.author = new_poem.own_poem === true ? this.storage.user_name : new_poem.author;

    const entry = {
      owner_id: this.client.authedId(),
      title: new_poem.title,
      poem: new_poem.poem,
      for_email: new_poem.for_email,
      tags: this.stringToArray(new_poem.tags),
      date: new Date(),
      public: new_poem.public,
      author: new_poem.author,
      own_poem: new_poem.own_poem,
      published: new_poem.published
    };
    this.log.raw(entry);
    return this.poem_collection
                  .insertOne(entry);
  }
  updatePoem(_id, update_fields) {
    this.log.functionName = "updatePoem";
    this.log.i("Update poem");
    this.log.raw(update_fields);
    this.log.raw(_id);
    return this.poem_collection
          .updateOne({_id: _id, owner_id: this.client.authedId()}, {$set: update_fields});
  }
  updateLikes(_id, update_fields) {
    this.log.functionName = "updateLikes";
    this.log.i("Update poem");
    this.log.raw(update_fields);
    this.log.raw(_id);
    return this.poem_collection
          .updateOne({_id: _id}, {$inc: update_fields});
  }
  deletePoem(_id) {
    this.log.functionName = "deletePoem";
    this.log.i("Delete poem");
    this.log.raw(_id);
    return this.poem_collection
          .deleteOne({_id: _id, owner_id: this.client.authedId()});
  }
  getPoems() {
    this.log.functionName = "getPoems";
    this.log.i("Getting poems");
    try {
      this.storage.is_busy = true;
      this.client
        .executeFunction("getListOfSubmittedPoems")
        .then(result => {
          this.log.i("Poems fetched.");
          this.poem_list = [];
          result.forEach(element => {
            const temp = new Poem();
            temp._id = element._id;
            temp.title = element.title;
            temp.public = element.public;
            temp.published = element.published;
            temp.own_poem = element.own_poem;
            this.poem_list.push(temp);
          });
          const data = this.poem_list.slice();
          this.poems_subject.next(data);
          this.storage.is_busy = false;

        })
        .catch(err => {
          this.storage.is_busy = false;
          this.log.e(err);
        });
    } catch (err) {
      this.log.e(err);
    }
  }
  getPoem(poem_id) {
    this.log.functionName = "getPoem";
    this.log.i(`Getting poem ${poem_id}`);
    try {
      this.storage.is_busy = true;
      this.poem_subject.next(null);
      this.client
        .executeFunction("getPoem", poem_id)
        .then(result => {
          this.log.i("Poem fetched.");
          const poem = {
            _id: result._id,
            title: result.title,
            author: result.author,
            poem: result.poem,
            date_submitted: result.date_submitted,
            for_email: result.for_email,
            tags: result.tags,
            likes: result.likes,
            owner_id: result.owner_id,
            public: result.public,
            own_poem: result.own_poem,
            published: result.published,
            shares: result.shares
          };
          this.poem_subject.next(poem);
          this.storage.is_busy = false;
        })
        .catch(err => {
          this.storage.is_busy = false;
          this.log.e(err);
        });
    } catch (err) {
      this.log.e(err);
      this.storage.is_busy = false;
    }
  }
  getRandomPoem(prev_id) {  // any number
    this.log.functionName = "getRandomPoem";
    this.log.i("Getting random poem");
    try {
      prev_id = (prev_id === null) ? "5a5c60a68f25b906c03eb928" : prev_id;
      if (this.isAuthenticated() === false || this.isAuthenticated() === null) {
        this.doLoginAnonymous();
      }
      this.storage.is_busy = true;
      let filters = [];
      if ( this.storage.is_filtered) {
        filters = this.stringToArray(this.storage.filter_tags);
      } else {
        filters = null;
      }
      this.log.l(filters);
      this.client
        .executeFunction("getRandomPoemByTags", filters, prev_id)
        .then(result => {
          this.log.i("Random poem fetched.");
          const poem = {
            _id: result._id,
            title: result.title,
            author: result.author,
            poem: result.poem,
            date_submitted: result.date_submitted,
            for: result.for,
            for_email: result.for_email,
            tags: result.tags,
            likes: result.likes,
            owner_id: result.owner_id,
            public: result.public,
            own_poem: result.own_poem,
            published: result.published,
            shares: result.shares
          };
          // this.log.raw(poem);
          this.random_poem_subject.next(poem);
          this.storage.is_busy = false;
        })
        .catch(err => {
          this.storage.is_busy = false;
          this.log.e(err);
        });
    } catch (err) {
      this.log.e(err);
      this.storage.is_busy = false;
    }
  }
  arrayToString(data): string {
    let result = "";
    this.log.l("999");
    if(data !== null && data !== undefined) {
      this.log.l("666");
      if ( data.length > 0) {
        data.forEach(element => {
          result += element + " ; ";
        });
      }
    }
    return result;
  }
  stringToArray(data) {
    let tags = [];
    if (data !== undefined && data !== null) {
      tags = data.split(";");
    }
    return tags.map(tag => tag.trim().toLowerCase());
  }
}
