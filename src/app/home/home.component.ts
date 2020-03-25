import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/models';
import { UserService, AuthenticationService } from '@app/services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  currentUser: User;
  userFromApi: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.loading = true;
    this.userService
      .getById(this.currentUser.id)
      .pipe(first())
      .subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
      });
  }

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
