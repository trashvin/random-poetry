import { RouterModule, Routes } from "@angular/router";
import { Router, ActivatedRoute, CanActivate} from "@angular/router";

import { PoemComponent } from "./poem/poem.component";
import { AboutComponent } from "./about/about.component";
import { UserComponent } from "./user/user.component";
import { SettingsComponent } from "./settings/settings.component";
import { PoemDetailComponent } from "./poem-detail/poem-detail.component";
import { ProfileResolver } from "./_shared/resolvers/profile.resolver";
import { PoemResolver } from "./_shared/resolvers/poem.resolver";
import { PoemGuardService } from "./_shared/services/service";

const ROUTES: Routes = [
  {
    path: "",
    redirectTo: "/poem",
    pathMatch: "full",
    canActivate: [PoemGuardService]
  },
  { path: "user", component: UserComponent, resolve: { profile: ProfileResolver } },
  { path: "poem", component: PoemComponent, canActivate: [PoemGuardService] },
  { path: "settings", component: SettingsComponent},
  { path: "details", component: PoemDetailComponent},
  { path: "detail/:poem_id", component: PoemDetailComponent, resolve: { poem: PoemResolver}},
  { path: "about", component: AboutComponent }
];

export const AppRoutes = RouterModule.forRoot(ROUTES);
