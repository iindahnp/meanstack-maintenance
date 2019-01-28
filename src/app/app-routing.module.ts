import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import 'rxjs/Rx';

import { LoginComponent } from './home/login.component';
import { AboutComponent } from './home/about.component';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './main/result.component';
import { FrequencyComponent } from './main/frequency.component';
import { DowncriComponent } from './main/downcri.component';
import { FreqcriComponent } from './main/freqcri.component';
import { UserModule } from './user/user.module';


 
  const appRoutes: Routes =[
        { path: 'login', component: LoginComponent},
        { path: 'about', component: AboutComponent},
        { path: 'main', component: MainComponent},     
        { path: 'result', component: ResultComponent }, 
        { path: 'frequency', component: FrequencyComponent }, 
        { path: 'downcri', component: DowncriComponent },
        { path: 'freqcri', component: FreqcriComponent },  
        { path: '', redirectTo: 'login', pathMatch: 'full'  },
        { path: '**', redirectTo: 'login', pathMatch: 'full' }
  ];
  @NgModule({
    imports: [
        UserModule,
        RouterModule.forRoot(appRoutes)
    ],
    exports:[RouterModule]
  })
export class AppRoutingModule { }
