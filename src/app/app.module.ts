import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { LoginComponent } from './home/login.component';
import { AboutComponent } from './home/about.component';

/* Feature Modules */
import { UserModule } from './user/user.module';
import { MainModule } from './main/main.module';
import { AppRoutingModule} from './app-routing.module';


/* common Modules */
import { ToastrService } from './common/toastr.service';
import { ResultComponent } from './main/result.component';
import { FrequencyComponent } from './main/frequency.component';
import { DowncriComponent } from './main/downcri.component';
import { FreqcriComponent } from './main/freqcri.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    UserModule,
    MainModule,
    AppRoutingModule
    
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    ResultComponent,
    FrequencyComponent,
    DowncriComponent,
    FreqcriComponent
    
  ],
  bootstrap: [AppComponent],
  providers: [ToastrService]
})
export class AppModule { }
