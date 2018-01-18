import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  version;
  constructor( private router: Router) {
    this.version = environment.version;
   }
   onHome() {
    this.router.navigate(["poem"]);
   }
   gotoGithubRepo() {
     window.open("https://github.com/trashvin/random-poetry", "_blank");
   }
   reportBug() {
     // https://github.com/trashvin/random-poetry/issues
     window.open("https://github.com/trashvin/random-poetry/issues", "_blank");
   }
  ngOnInit() {
  }

}
