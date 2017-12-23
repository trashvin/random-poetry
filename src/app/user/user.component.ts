import { Component, OnInit } from "@angular/core";

import { SessionService } from "../_shared/service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

  constructor(
    public session: SessionService
  ) { }

  ngOnInit() {
  }
  onGoogleLogin() {
    this.session.is_logged_in = true;
  }
  onLogout() {
    this.session.is_logged_in = false;
  }

}
