import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Router, ActivatedRoute, CanActivate } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";

import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { AuthService, SessionService } from "./_shared/service";
import { PoemComponent } from "./poem/poem.component";
import { AppRoutes } from "./app.route";
import { SettingsComponent } from "./settings/settings.component";
import { AddPoemComponent } from "./add-poem/add-poem.component";
import { UserComponent } from "./user/user.component";

@NgModule({
  declarations: [
    AppComponent,
    PoemComponent,
    UserComponent,
    SettingsComponent,
    AddPoemComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    AngularFireAuthModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase, "random-poetry-dev")
  ],
  providers: [
    AuthService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
