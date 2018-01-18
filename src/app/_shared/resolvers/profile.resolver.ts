import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

import { StitchService } from "../services/service";
import { Logger } from "../libraries/logger";

@Injectable()
export class ProfileResolver implements Resolve<any> {
  private log = new Logger("Profile", "Resolver");
  constructor(
    private stitch: StitchService
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    if (this.stitch.isAuthenticated() === true) {
      this.log.i("Resolving profile.");
      return this.stitch.getUserProfile();
    } else {
      return null;
    }
  }
}
