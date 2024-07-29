import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Users } from '../_models/Users';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //private apiUrl = 'https://localhost:7145/api/Account'
  private apiUrl = 'https://b311-2001-8a0-ddc5-5701-c90-f7ce-2199-236a.ngrok-free.app/api/Account'
  public loggedUser: Users;
  constructor(private http: HttpClient) { }

  criarConta(Username: string, Password: string, Email: string, Name: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/CriarConta`, {
        Username,
        Password,
        Email,
        Name,
      })
      .pipe(
        map((response) => {
          if (response && response.code === 1 && response.data) {
            this.loggedUser = response.data;
            console.log("TESEESE");
          }
          return response;
        })
      );
  }

  login(Username: string, Password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login`, {Username, Password})
      .pipe(map((response) => {
        if(response && response.code === 1 && response.data){
          this.loggedUser = response.data;
          console.log(this.loggedUser.token);
        }
        return response;
      }))
  }
}
