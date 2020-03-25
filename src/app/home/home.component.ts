import { Component } from '@angular/core';
import { User } from '@app/models';
import { AuthenticationService } from '@app/services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  currentUser: User;
  userFromApi: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  calc() {
    alert(1);
  }

  config() {
    alert(2);
  }
}
