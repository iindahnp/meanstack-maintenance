import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from '../common/toastr.service'
import { MainService } from './main.service';
import { AuthService } from '../user/auth.service';
//import { Subscription } from 'rxjs/Subscription';
//import { IMain } from './main';

@Component({
  templateUrl: './main.component.html'
})

export class MainComponent implements OnInit {
  
  //main: IMain;
  //private sub: Subscription;
  mainForm: FormGroup;
  userObj: any;
  acc: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  mainid: string;
  pgTitle: string;
  btnLbl: string;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe) {
  }

  ticketid = new FormControl('',[Validators.required]);
  mdate = new FormControl('');
  mtool = new FormControl('');
  mdesc = new FormControl('');
  mtech = new FormControl('');
  rsdate = new FormControl('');
  rcom = new FormControl('');
  fixdate = new FormControl('');
  
  
  

  ngOnInit(){
    
    /*this.sub = this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.updateRepair(id);
      });
    */

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.mainid = params['id'];
        this.getMain(this.mainid);
        this.pgTitle = "Update";
        this.btnLbl = "Update"
      } else {
        this.pgTitle = "Add";
        this.btnLbl = "Submit"
      }
    });
    
    this.userObj =  this.authService.currentUser;
    this.mainForm = this.fb.group({
      ticketid: this.ticketid,
      mdate: this.mdate,
      mtool: this.mtool,
      mdesc: this.mdesc,
      mtech: this.mtech,
      rsdate: this.rsdate,
      rcom :this.rcom,
      fixdate: this.fixdate
    });
  }
  
 /* ngOnDestroy() {
    this.sub.unsubscribe();
  }


 updateRepair(id){
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
  */

  getMain(id){
    this.mainService.getMain(id).subscribe(data => {
      if (data.success === true) {
        if (data.data[0]) {
          this.populateForm(data.data[0]);
        } else {
          this.toastr.error('Maintenance id is incorrect in the URL');
          this.router.navigate(['report']);
        }
      }
    });
  }

  populateForm(data): void {
    this.mainForm.patchValue({
      ticketid: data.ticketid,
      mdate: this.datePipe.transform(data.maindate, 'y-MM-dd'),
      mtool: data.maintool,
      mdesc: data.maindesc,
      mtech: data.maintech,
      rsdate: data.rsdate,
      rcom:data.rcom,
      fixdate: data.fixdate
          });
  }

  saveMain(formdata:any): void {
    if (this.mainForm.valid) {
      const theForm = this.mainForm.value;
      if (this.mainid !== '') {
        theForm.mainid = this.mainid;
      }
      
      this.mainService.saveMain(this.userObj.userid,theForm)
        .subscribe(data => {
          if (data.success === false) {
            if (data.errcode){
              this.authService.logout();
              this.router.navigate(['login']);
            }
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
          if (!this.mainid) {
            this.mainForm.reset();
          }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/report'], { preserveQueryParams: true });
  }

  }
