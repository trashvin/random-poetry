import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router } from "@angular/router";
//
import { Logger } from "../libraries/logger";
import { StorageService } from "../services/storage.service";

@Injectable()
export class PoemGuardService implements CanActivate {
  private log = new Logger("PoemGuard", "Service");
  constructor(
    private storage: StorageService,
    private router: Router
  ) {}
  // this is a fix to netlify issue
  canActivate(): boolean {
    this.log.functionName = "canActivate";
    this.log.i("Poem Guard is ON");
    if (this.storage.is_logging_in) {
      this.log.l("User is currently logging in");
      this.log.l("Redirecting to user");
      this.router.navigate(["user"]);
      return false;
    } else {
      this.log.l("Route allowed");
      return true;
    }
  }
}
