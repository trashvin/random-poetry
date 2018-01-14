import { Component, OnInit } from "@angular/core";

import { SessionService, StitchService } from "../_shared/service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  constructor(
    public session: SessionService,
    public stitch: StitchService
  ) { }

  ngOnInit() {
  }
  onGoogleLogin() {
    this.stitch.doLoginGoogle();
  }
  onFBLogin() {
    this.stitch.doLoginFB();
  }
  onLogout() {
    this.stitch.doLogout();
  }

}
