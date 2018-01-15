import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, ISubscription } from "rxjs/Subscription";


import { SessionService, StorageService, StitchService, AlertService } from "./_shared/services/service";
import { AppConstants } from "./app.constant";
import { Logger } from "./_shared/libraries/logger";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private log = new Logger("App", "Component");
  title = "random poetry";
  name: string;
  pic_url: string;
  subscriber: ISubscription;
  alert_message: string;
  constructor(
    private alert: AlertService,
    private stitch: StitchService,
    private storage: StorageService,
    private constant: AppConstants,
    private router: Router,
    public session: SessionService
  ) {
    this.subscriber = this.alert.getMessage().subscribe( message => {
      this.session.is_busy = false;
      // window.alert(message.text);
      this.alert_message = message.text;
      $(#alertBox).modal("show");
    });

    session.is_home = true;
    this.name = this.session.is_logged_in === true ? this.session.user_name : "guest";
    this.pic_url = this.session.is_logged_in === true ? this.session.user_picture : "assets/user_small.jpg";
  }
  onSignIn() {
    this.session.is_home = false;
    if ( this.session.is_anonymous === true) {
      this.stitch.doLogout().then(() => {
        this.session.is_logged_in = false;
        this.session.clear();
        this.router.navigate(["user"]);
      }). catch( err => {
        this.log.e(err);
      });
    } else {
      this.router.navigate(["user"]);
    }
  }
  onSettings() {
    this.session.is_home = false;
    this.router.navigate(["settings"]);
  }
  onAdd() {
    this.session.current_action = this.constant.action_add;
    this.session.is_home = false;
    this.router.navigate(["details"]);
      }
  onBack() {
    this.session.is_home = true;
    this.router.navigate(["/"]);
  }
  onHome() {
    this.session.is_home = true;
    this.router.navigate(["/"]);
  }
  onDashboard() {
    this.router.navigate(["user"]);
  }
  onSignOff() {
    this.stitch.doLogout().then(() => {
      this.session.is_logged_in = false;
      this.session.clear();
      this.router.navigate(["/"]);
    }). catch( err => {
      this.log.e(err);
    });
  }
  getRawName() {
    const name = this.session.user_name;
    if ( this.session.is_logged_in ) {
      return name.replace(/(\r\n|\n|\r)/gm, "");
    } else {
      return "guest";
    }
  }
}
