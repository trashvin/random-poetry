import { RouterModule, Routes } from "@angular/router";
import { Router, ActivatedRoute, CanActivate} from "@angular/router";

import { PoemComponent } from "./poem/poem.component";
import { UserComponent } from "./user/user.component";
import { SettingsComponent } from "./settings/settings.component";
import { AddPoemComponent } from "./add-poem/add-poem.component";

const ROUTES: Routes = [
  {
    path: "",
    redirectTo: "/poem",
    pathMatch: "full"
  },
  { path: "user", component: UserComponent },
  { path: "poem", component: PoemComponent },
  { path: "settings", component: SettingsComponent},
  { path: "new", component: AddPoemComponent}
];

export const AppRoutes = RouterModule.forRoot(ROUTES);
