import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { SessionService } from "./_shared/service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "random poetry";
  constructor(
    private router: Router,
    public session: SessionService
  ) {
    session.is_home = true;
  }
  onLogin() {
    this.session.is_home = false;
    this.router.navigate(["/user"]);
  }
  onSettings() {
    this.session.is_home = false;
    this.router.navigate(["settings"]);
  }
  onAdd() {
    this.session.is_home = false;
    this.router.navigate(["new"]);
      }
  onBack() {
    this.session.is_home = true;
    this.router.navigate(["/"]);
  }
  onNext() {
  }
}
