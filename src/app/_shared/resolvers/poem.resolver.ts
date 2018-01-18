import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

import { StitchService } from "../services/service";
import { Logger } from "../libraries/logger";

@Injectable()
export class PoemResolver implements Resolve<any> {
  private log = new Logger("Poem", "Resolver");
  constructor(
    private stitch: StitchService
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    this.log.i("Resolving a poem.");
    this.stitch.getPoem(route.params.poem_id);
    this.stitch.observable_poem.subscribe( result => {
      this.log.l("Received...");
      this.log.i(result);
      return result;
    });
    // return this.stitch.getUserProfile();
  }
}
