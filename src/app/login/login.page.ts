import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { AuthService } from '../auth/auth.service';
import { Users } from '../_models/Users';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup
  constructor(private router: Router, private _formBuilder: FormBuilder, private loginApi: LoginService, private authService: AuthService) { }
  Username: string;
  Password: string;
  Users: Users;
  
  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      Username: [this.Username ? this.Username : 'nelson', Validators.required],
      Password: [this.Password ? this.Password : '1234', Validators.required]
    });
  }

  get f(){
    return this.loginForm.controls;
  }

  login(){
    this.loginApi.login(this.f['Username'].value, this.f['Password'].value)
      .pipe(first())
      .subscribe((data) => {
        if(data.code == 1){
          this.authService.setAuthenticated(true);
          this.router.navigate(['tabs']);

        }
      })
  }

  criarConta(){
    this.router.navigate(['/criar-conta']);
  }

}
