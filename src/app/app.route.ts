import { RouterModule, Routes } from "@angular/router";
import { Router, ActivatedRoute, CanActivate} from "@angular/router";

import { PoemComponent } from "./poem/poem.component";
import { UserComponent } from "./user/user.component";
import { SettingsComponent } from "./settings/settings.component";
import { PoemDetailComponent } from "./poem-detail/poem-detail.component";
import { ProfileResolver } from "./_shared/resolvers/profile.resolver";
import { PoemResolver } from "./_shared/resolvers/poem.resolver";

const ROUTES: Routes = [
  {
    path: "",
    redirectTo: "/poem",
    pathMatch: "full"
  },
  { path: "user", component: UserComponent, resolve: { profile: ProfileResolver } },
  { path: "poem", component: PoemComponent },
  { path: "settings", component: SettingsComponent},
  { path: "details", component: PoemDetailComponent},
  { path: "detail/:poem_id", component: PoemDetailComponent, resolve: { poem: PoemResolver}}
];

export const AppRoutes = RouterModule.forRoot(ROUTES);
