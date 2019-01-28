import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ReportComponent } from './report.component';
import { MainComponent } from './main.component';
import { ViewmainComponent } from './viewmain.component';
import { AuthGuard } from '../user/auth-guard.service';
import { AuthService } from '../user/auth.service';
import { MainService } from './main.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'report', canActivate: [ AuthGuard], component: ReportComponent },
      { path: 'main', canActivate: [ AuthGuard], component: MainComponent },
      { path: 'main/:id', canActivate: [ AuthGuard], component: MainComponent },
      { path: 'main/view/:id', canActivate: [ AuthGuard], component: ViewmainComponent },
  
    ])
  ],
  declarations: [
    ReportComponent,
    MainComponent,
    ViewmainComponent,
  
  ],
  providers: [
    DatePipe,
    AuthService,
    AuthGuard,
    MainService
  ]
})
export class MainModule {}