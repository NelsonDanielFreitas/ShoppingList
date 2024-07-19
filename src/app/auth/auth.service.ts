
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Method to check if the user is authenticated
  DisAuthenticated() {
    return this.isAuthenticated.value;
  }

  // Method to set the authentication status
  setAuthenticated(status: boolean) {
    this.isAuthenticated.next(status);
  }
}
