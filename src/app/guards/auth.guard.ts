import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, CanActivate, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { environment } from 'environments/environment';

import { GemExchangeAPI } from 'app/services/api.service';

@Injectable()

export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private route:  ActivatedRoute,
    public  api:    GemExchangeAPI
  ) {}

  /**
   *  @function canActivate()
   *  @description Checks if a user is allowed to navigate to a page.
   *  @return {boolean}
   */
  canActivate() {
    // Check login status - if user isn't logged in, redirect to login
    if (!this.api.isLoggedIn()) {
      this.router.navigate(['/home']);
    } 
    return this.api.isLoggedIn();
  }
}