import { Component } from '@angular/core';
import { StorageService } from './auth/components/services/auth/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdminLoggedIn: boolean = StorageService.isAdmin();
  isUserLoggedIn: boolean = StorageService.isUser();

  constructor(private router: Router) {}

  ngOnInit(){
    this.router.events.subscribe(event => {
      this.isAdminLoggedIn = StorageService.isAdmin();
      this.isUserLoggedIn = StorageService.isUser();
    })
  }

  logout(){
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }
}
