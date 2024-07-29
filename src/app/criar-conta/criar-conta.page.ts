import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from '../_models/Users';
import { LoginService } from '../_services/login.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {
  criarContaForm: FormGroup;
  Username: string;
  Password: string;
  Email: string;
  Name: string;
  constructor(private _formBuilder: FormBuilder, private loginApi: LoginService, private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.criarContaForm = this._formBuilder.group({
      Username: [this.Username ? this.Username : 'nelson', Validators.required],
      Password: [this.Password ? this.Password : '1234', Validators.required],
      Email: [this.Email ? this.Email : 'nelsonfreitas@ipvc.pt', Validators.required],
      Name: [this.Name ? this.Name : 'Nelson Freitas', Validators.required] 
    });
  }

  get f(){
    return this.criarContaForm.controls;
  }

  criarConta(){
    this.loginApi.criarConta(this.f['Username'].value, this.f['Password'].value, this.f['Email'].value, this.f['Name'].value)
      .pipe(first()).subscribe(
        async (data) => {
          if(data.code == 1){
            this.authService.setAuthenticated(true);
            this.router.navigate(['tabs']);
            console.log("fds");
          }else{
            //console.log(data.infomapper.textmessage);
          }
        },(error) => {
          
        }
      )
      
  }

  login(){
    this.router.navigate(['login']);
  }

}
