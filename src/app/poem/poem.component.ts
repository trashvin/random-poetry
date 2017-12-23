import { Component, OnInit } from "@angular/core";

import { SessionService } from "../_shared/service";
@Component({
  selector: "app-poem",
  templateUrl: "./poem.component.html",
  styleUrls: ["./poem.component.css"]
})
export class PoemComponent implements OnInit {
  hearts = 0;
  body: string;
  constructor(
    public session: SessionService
  ) { }
 
  ngOnInit() {
    this.body = "I crawled into bed and closed my eyes \
                and not long after heard the small \
                hooves of the horses, the tiny ones \
                that gallop in our dreams, or are \
                they the dreams of our children, \
                galloping through the black ruins. ";
  }
  onHeart() {
    this.hearts += 1;
  }

}
