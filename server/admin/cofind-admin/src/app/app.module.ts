import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReportsComponent} from './reports/reports.component';
import {HomeComponent} from './home/home.component';
import {ReportsService} from "./reports/reports.service";
import { ModifyComponent } from './modify/modify.component';
import {ModifyService} from "./modify/modify.service";
import { CreateComponent } from './create/create.component';
import { CreateUserComponent } from './create/create-user/create-user.component';
import { CreateGroupComponent } from './create/create-group/create-group.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportsComponent,
    HomeComponent,
    ModifyComponent,
    CreateComponent,
    CreateUserComponent,
    CreateGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ReportsService,
    ModifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
