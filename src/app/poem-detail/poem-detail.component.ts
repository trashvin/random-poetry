import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core/src/metadata/directives";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";


import { AppConstants } from "../app.constant";
import { Logger } from "../_shared/libraries/logger";
import { StitchService, AlertService, StorageService } from "../_shared/services/service";
import { Poem } from "../_shared/models/poem";

@Component({
  selector: "app-poem-detail",
  templateUrl: "./poem-detail.component.html",
  styleUrls: ["./poem-detail.component.css"]
})
export class PoemDetailComponent implements OnInit {
  private log = new Logger("PoemDetail", "Component");
  private subscriber: Subscription;
  detail_form: FormGroup;
  allow_edit = true;
  action;
  _id;
  title;
  view_label = "";
  poem = new Poem();
  display = "none";
  // title = new FormControl();
  // poem = new FormControl();
  // receipient = new FormControl();
  // tags = new FormControl();
  // is_public = new FormControl();
  constructor(
    private alert: AlertService,
    private constant: AppConstants,
    private stitch: StitchService,
    private router: Router,
    private route: ActivatedRoute,
    public storage: StorageService
  ) { }

  ngOnInit() {
    this.buildForm();
    try {
      if (this.storage.current_action !== this.constant.action_add) {
        this.subscriber = this.route.params.subscribe(params => {
          this.stitch.observable_poem.subscribe(result => {
            this.log.l("Received...");
            this.log.raw(result);
            if (result !== null) {
              // this.log.l("im innnnn");
              this.setFormValue(result);
            }
          });
        });
      } else {
        this.allow_edit = true;
      }
    } catch (ex) {
      this.log.e(ex);
    }
    this.view_label = this.action === this.constant.action_add ? "new poem" : "poem detail";
  }
  onCancel() {
    this.router.navigate(["user"]);
    // this.getChangedFields();
  }
  onSubmit() {
    this.log.l(JSON.stringify(this.detail_form.value));
    this.log.l(this.detail_form.status);
    if (this.detail_form.status === "VALID") {
      if (this.storage.current_action === this.constant.action_add) {
        this.log.i("Saving new poem...");
        this.addPoem();
      } else {
        this.log.l("Updating poem");
        this.updatePoem();
      }
    } else {
      this.router.navigate(["/"]);
      this.alert.sendMessage("No changes");
    }
  }
  addPoem() {
    try {
      this.allow_edit = false;
      this.getFormValue();
      this.storage.is_busy = true;
      this.stitch.addPoem(this.poem).then(result => {
        this.log.i("New poem saved.");
        this.storage.is_busy = false;
        this.alert.sendMessage("New poem saved!");
        this.router.navigate(["user"]);
      }).catch(err => {
        this.log.e("Error saving poem");
        this.storage.is_busy = false;
        this.alert.sendMessage("Error saving new poem.");
        this.allow_edit = true;
      });
    } catch (ex) {
      this.log.e(ex);
    }
  }
  updatePoem() {
    const changes = this.getChangedFields();
    this.allow_edit = false;
    this.storage.is_busy = true;
    this.stitch.updatePoem(this._id, changes).then( result => {
      this.log.i("Changes saved.");
      this.storage.is_busy = false;
      this.alert.sendMessage("Updated poem!");
      this.router.navigate(["user"]);
    }).catch(err => {
      this.log.e("Error saving poem");
      this.storage.is_busy = false;
      this.alert.sendMessage("Error saving updated poem.");
      this.allow_edit = true;
      this.storage.is_busy = false;
    });
  }
  onDelete() {
    this.display = "block";
  }
  deletePoem() {
    this.storage.is_busy = true;
      this.stitch.deletePoem(this._id).then( result => {
        this.log.i("Successfully deleted poem.");
        this.storage.is_busy = false;
        this.alert.sendMessage("Successfully deleted poem.");
        this.router.navigate(["user"]);
      }).catch(err => {
        this.log.e("Error deleting poem");
        this.storage.is_busy = false;
        this.alert.sendMessage("Error deleting poem.");
        this.allow_edit = true;
        this.storage.is_busy = false;
      });
      this.display = "none";
  }
  onCancelDelete() {
    this.display = "none";
  }
  private setFormValue(result) {
    this.log.l(result.title);
    this._id = result._id;
    this.title = result.title;
    this.detail_form.setValue({
      "title": result.title,
      "author": result.author,
      "poem": result.poem,
      "for_email": result.for_email,
      "tags": this.arrayToString(result.tags),
      "public": result.public !== true ? false : true,
      "own_poem": result.own_poem !== true ? false : true,
      "published": result.published !== true ? false : true
    });
  }
  private getFormValue() {
    this.poem.title = this.detail_form.get("title").value;
    this.poem.author = this.detail_form.get("author").value;
    this.poem.poem = this.detail_form.get("poem").value;
    this.poem.for_email = this.detail_form.get("for_email") !== null ? this.detail_form.get("for_email").value : "";
    this.poem.public = this.detail_form.get("public") !== null ? this.detail_form.get("public").value : false;
    this.poem.tags = this.detail_form.get("tags") !== null ? this.detail_form.get("tags").value : "";
    this.poem.own_poem = this.detail_form.get("own_poem") !== null ? this.detail_form.get("own_poem").value : false;
    this.poem.published = this.detail_form.get("published") !== null ? this.detail_form.get("published").value : false;
  }
  private buildForm() {
    this.detail_form = new FormGroup({
      title: new FormControl("", Validators.required),
      author: new FormControl("", Validators.required),
      poem: new FormControl("", Validators.required),
      for_email: new FormControl("", Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")),
      tags: new FormControl(),
      public: new FormControl(),
      own_poem: new FormControl(),
      published: new FormControl()
    });
  }
  private getChangedFields(): any {
    const result = {};
    Object.keys(this.detail_form.controls).forEach(key => {
      if (this.detail_form.get(key).dirty) {
        if (key === "own_poem") {
          if (result[key]) {
            result["author"] = this.storage.user_name;
          } else {
            result["author"] = this.detail_form.get("author").value;
          }
        }
        if (key === "tags") {
          result[key] = this.stringToArray(this.detail_form.get(key).value);
        } else {
          result[key] = this.detail_form.get(key).value;
        }
      }
    });
    return result;
  }
  private arrayToString(data): string {
    let result = "";
    if (data !== null && data !== undefined) {
      if ( data.length > 0) {
        data.forEach(element => {
          result += element + " ;";
        });
      }
    }
    return result;
  }
  stringToArray(data) {
    // data = data.map( word => word.trim());
    let tags = [];
    if (data !== undefined && data !== null) {
      tags = data.split(";");
    }
    return tags.map(tag => tag.trim().toLowerCase());
  }
  // private stringToArray(data) {
  //   let tags = [];
  //   if (tags !== undefined) {
  //     tags = this.tags.split(";");
  //   }
  //   return tags;
  // }
}
