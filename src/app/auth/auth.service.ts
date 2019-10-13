import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthentucated = true;
  private _userId = 'abc';

  get userIsAuthentucated() {
    return this._userIsAuthentucated;
  }

  get userId() {
    return this._userId;
  }

  constructor() { }

  login() {
    this._userIsAuthentucated = true;
  }

  logout() {
    this._userIsAuthentucated = false;
  }
}
