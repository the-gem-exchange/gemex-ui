// Modules
import { Routes, RouterModule } from "@angular/router";

// Public Views
import { DashboardComponent } from "app/views/dashboard/dashboard.component";
import { DiscordComponent }   from "app/views/discord/discord.component";
import { TosComponent }       from "app/views/tos/tos.component";
import { MYOComponent }       from "app/views/myo/myo.component";

// Auth views
import { LoginComponent } from "app/views/login/login.component";

import { UserComponent } from "app/views/user/profile/user.component";

// Stardragons
import { StardragonComponent }     from "app/views/stardragon/profile/stardragon.component";
import { StardragonListComponent } from "app/views/stardragon/list/stardragon-list.component";
import { TraitsComponent }         from 'app/views/stardragon/traits/traits.component';

// Routing Guards
import { LoggedInGuard } from "app/guards/logged-in.guard";
import { DevGuard }      from "app/guards/dev.guard";

export const ROUTES: Routes = [
    // Main redirect
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // Public Pages
    { path: 'home',           component: DashboardComponent },
    { path: 'discord',        component: DiscordComponent   },
    { path: 'termsofservice', component: TosComponent       },
    { path: 'makeyourown',    component: MYOComponent, canActivate: [DevGuard]},

    { path: 'login', component: LoginComponent, canActivate: [DevGuard]},

    { path: 'users',          component: UserComponent,  canActivate: [DevGuard]},
    { path: 'users/:user_id', component: UserComponent,  canActivate: [DevGuard]},

    // Stardragons
    { path: 'stardragons',                      component: StardragonListComponent,  canActivate: [DevGuard]},
    { path: 'stardragons/profile',              component: StardragonComponent,      canActivate: [DevGuard]},
    { path: 'stardragons/traits',               component: TraitsComponent },
    { path: 'stardragons/traits/:species_name', component: TraitsComponent },

    // Redirect old routes
    { path: 'species/:species_name', redirectTo: 'stardragons/traits/:species_name', pathMatch: 'full' },

    // Handle all other routes
    { path: '**', redirectTo: '' },
];
