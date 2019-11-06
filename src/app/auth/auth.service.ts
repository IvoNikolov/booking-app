import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthentucated = false;
  private _userId = 'ivo';

  get userIsAuthentucated() {
    return this._userIsAuthentucated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
      environment.firebaseAPIkey
    }`, {
      email,
      password,
      returnSecureToken: true
    });
  }

  login() {
    this._userIsAuthentucated = true;
  }

  logout() {
    this._userIsAuthentucated = false;
  }
}
