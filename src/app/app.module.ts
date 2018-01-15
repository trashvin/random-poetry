import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Router, ActivatedRoute, CanActivate } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { StitchService, AlertService, SessionService, StorageService } from "./_shared/services/service";
import { PoemComponent } from "./poem/poem.component";
import { AppRoutes } from "./app.route";
import { SettingsComponent } from "./settings/settings.component";
import { UserComponent } from "./user/user.component";
import { AppConstants } from "./app.constant";
import { ProfileResolver } from "./_shared/resolvers/profile.resolver";
import { PoemDetailComponent } from "./poem-detail/poem-detail.component";
import { PoemResolver } from "./_shared/resolvers/poem.resolver";
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    PoemComponent,
    UserComponent,
    SettingsComponent,
    UserComponent,
    PoemDetailComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutes,
  ],
  providers: [
    StitchService,
    SessionService,
    AlertService,
    AppConstants,
    ProfileResolver,
    StorageService,
    PoemResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
