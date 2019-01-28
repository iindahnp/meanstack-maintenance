import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from './main.service';
import { AuthService } from '../user/auth.service';
import { ToastrService } from '../common/toastr.service';
import { Subscription } from 'rxjs/Subscription';
import { IMain } from './main';

@Component({
  templateUrl: './viewmain.component.html'
})

export class ViewmainComponent implements OnInit, OnDestroy {
  
  main: IMain;
  private sub: Subscription;


  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.getMain(id);
      });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    getMain(id){
      this.mainService.getMain(id).subscribe(data => {
        if (data.success === false) {
          if (data.errcode){
            this.authService.logout();
            this.router.navigate(['login']);
          }
          this.toastr.error(data.message);
        } else {
          if (data.data[0]) {
            this.main = data.data[0];
          } else {
            this.toastr.error('Maintenance id is incorrect in the URL');
          }
          
        }
      });
    }
    
    onBack(): void {
        this.router.navigate(['/report'], { preserveQueryParams: true });
    }
}