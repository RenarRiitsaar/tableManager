import { AddTicketComponent } from './modules/user/components/tickets/add-ticket/add-ticket.component';
import { Component, HostListener } from '@angular/core';
import { StorageService } from './auth/services/storage/storage.service';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdminLoggedIn: boolean = StorageService.isAdmin();
  isUserLoggedIn: boolean = StorageService.isUser();
  

  constructor(private router: Router,
              private authService: AuthService,
              private dialog:MatDialog
  ) {}

  ngOnInit(){
    this.router.events.subscribe(event => {
      this.isAdminLoggedIn = StorageService.isAdmin();
      this.isUserLoggedIn = StorageService.isUser();
    })


  }
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:click')
  @HostListener('window:touchstart')
  resetLogoutTimer(): void {
    this.authService.startLogoutTimer();
  }


  logout(){
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }
}
