import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, ISubscription } from "rxjs/Subscription";


import {  StorageService, StitchService, AlertService } from "./_shared/services/service";
import { AppConstants } from "./app.constant";
import { Logger } from "./_shared/libraries/logger";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  display = "none";
  private log = new Logger("App", "Component");
  title = "random poetry";
  name: string;
  pic_url: string;
  subscriber: ISubscription;
  alert_message: string;
  constructor(
    private alert: AlertService,
    private stitch: StitchService,
    public storage: StorageService,
    private constant: AppConstants,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.subscriber = this.alert.getMessage().subscribe( message => {
      this.storage.is_busy = false;
      // window.alert(message.text);
      this.alert_message = message.text;
      this.display = "block";
    });
    this.name = this.storage.is_logged_in === true ? this.storage.user_name : "guest";
    this.pic_url = this.storage.is_logged_in === true ? this.storage.user_picture : "assets/user_small.jpg";
  }
  dismissAlert() {
    this.display = "none";
  }
  onSignIn() {
    // if ( this.storage.is_anonymous === true) {
      this.stitch.doLogout().then(() => {
        this.storage.is_logged_in = false;
        this.storage.clear();
        this.router.navigate(["user"]);
      }). catch( err => {
        this.log.e(err);
      });
    // } else {
    //   this.router.navigate(["user"]);
    // }
  }
  onSettings() {
    this.router.navigate(["settings"]);
  }
  onAdd() {
    this.storage.current_action = this.constant.action_add;
    this.router.navigate(["details"]);
      }
  onBack() {
    this.router.navigate(["/"]);
  }
  onHome() {
    this.router.navigate(["/"]);
  }
  onDashboard() {
    this.router.navigate(["user"]);
  }
  onSignOff() {
    this.stitch.doLogout().then(() => {
      this.storage.is_logged_in = false;
      this.storage.clear();
      this.router.navigate(["/"]);
    }). catch( err => {
      this.log.e(err);
    });
  }
  getRawName() {
    const name = this.storage.user_name;
    if ( this.storage.is_logged_in ) {
      return name.replace(/(\r\n|\n|\r)/gm, "");
    } else {
      return "guest";
    }
  }
}
