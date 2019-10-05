import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthentucated = false;

  get userIsAuthentucated() {
    return this._userIsAuthentucated;
  }

  constructor() { }

  login() {
    this._userIsAuthentucated = true;
  }

  logout() {
    this._userIsAuthentucated = false;
  }
}
