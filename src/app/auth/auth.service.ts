import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthentucated = true;
  private _userId = 'ivo';

  get userIsAuthentucated() {
    return this._userIsAuthentucated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
      environment.firebaseAPIkey
    }`, {
      email,
      password,
      returnSecureToken: true
    }).subscribe();
  }

  login() {
    this._userIsAuthentucated = true;
  }

  logout() {
    this._userIsAuthentucated = false;
  }
}
