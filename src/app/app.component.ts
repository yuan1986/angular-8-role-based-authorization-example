import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { includes } from 'lodash';

@Component({ selector: "app", templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
  isHome;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isHome = !includes(e.url, 'login');
      });
  }
}
