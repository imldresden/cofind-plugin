import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportsComponent} from "./reports/reports.component";
import {ModifyComponent} from "./modify/modify.component";
import {CreateComponent} from "./create/create.component";
import {HomeComponent} from "./home/home.component";
import {CreateUserComponent} from "./create/create-user/create-user.component";
import {CreateGroupComponent} from "./create/create-group/create-group.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'modify', component: ModifyComponent },
  { path: 'create', component: CreateComponent },
  { path: 'create_user', component: CreateUserComponent },
  { path: 'create_group', component: CreateGroupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
