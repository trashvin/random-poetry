import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { AppConstants } from "../app.constant";
import { StitchService, StorageService } from "../_shared/services/service";
import { Logger } from "../_shared/libraries/logger";
import { Poem } from "../_shared/models/poem";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  subscriber: Subscription;
  private log = new Logger("User", "Component");
  user: string;
  email: string;
  picture: string;
  poem_list: Poem[] = [];
  constructor(
    public storage: StorageService,
    public stitch: StitchService,
    private router: Router,
    private route: ActivatedRoute,
    private constant: AppConstants
  ) {
   }

  ngOnInit() {
    this.subscriber = this.route.params.subscribe(params => {
      const profile = this.route.snapshot.data[this.constant.resolved_profile];
      this.log.l("Checking if authenticated");
      if (this.stitch.isAuthenticated()) {
        this.storage.user_name = profile.data.name;
        this.storage.user_email = profile.data.email;
        this.storage.user_picture = profile.data.picture;
        this.storage.is_logged_in = true;
        // this.storage.is_anonymous = false;
        this.stitch.getPoems();
      }
      this.stitch.observable_poems.subscribe( result => {
        this.poem_list = [];
        result.forEach(element => {
          this.poem_list.push(element);
        });
      });
    });
  }
  onGoogleLogin() {
    this.stitch.doLoginGoogle();
  }
  onFBLogin() {
    this.stitch.doLoginFB();
  }
  onLogout() {
    this.stitch.doLogout().then(() => {
      this.storage.is_logged_in = false;
      this.storage.clear();
      this.storage.is_anonymous = false;
      this.router.navigate(["/"]);
    }). catch( err => {
      this.log.e(err);
    });
  }
  onHome() {
    this.router.navigate(["/"]);
  }
  onAdd() {
    this.storage.current_action = this.constant.action_add;
    this.router.navigate(["details"]);
  }
  getPoemStatus(published: boolean, visible: boolean, orig: boolean): string {
    let result = "";
    result += published !== true ? "draft | " : "live | " ;
    result += visible !== true ? " private | " : "public | ";
    result += orig !== true ? "shared" : "written";
    return result;
  }
  showPoem(poem) {
    this.storage.current_action = this.constant.action_edit;
    this.router.navigateByUrl("/detail/" + poem._id);
    this.log.raw(poem);
  }
}
