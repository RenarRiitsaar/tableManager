import { AddTicketComponent } from './modules/user/components/tickets/add-ticket/add-ticket.component';
import { Component, HostListener } from '@angular/core';
import { StorageService } from './auth/services/storage/storage.service';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPdfSettingsComponent } from './modules/user/components/pdf-settings/add-pdf-settings/add-pdf-settings.component';
import { DeleteConfirmComponent } from './public-components/delete-confirm/delete-confirm.component';
import { PdfsettingsService } from './auth/services/pdfsettings/pdfsettings.service';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPDFComponent } from './modules/user/components/pdf-settings/edit-pdf/edit-pdf.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdminLoggedIn: boolean = StorageService.isAdmin();
  isUserLoggedIn: boolean = StorageService.isUser();
  isEnabled: boolean = StorageService.getStatus();
  

  constructor(private router: Router,
              private authService: AuthService,
              private dialog:MatDialog,
              private pdfSettings: PdfsettingsService,
              private snackbar: MatSnackBar
  ) {}

  ngOnInit(){
    this.router.events.subscribe(event => {
      this.isAdminLoggedIn = StorageService.isAdmin();
      this.isUserLoggedIn = StorageService.isUser();
      this.isEnabled = StorageService.getStatus();
    })


  }
  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:click')
  @HostListener('window:touchstart')
  resetLogoutTimer(): void {
    this.authService.startLogoutTimer();
  }

  editPDF(){
    this.dialog.open(EditPDFComponent, {
      width:'400px',
    });
  }

  createPDF(){
      this.dialog.open(AddPdfSettingsComponent, {
        width: '400px',
        });
  }

  deletePDF(){
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.pdfSettings.deleteSettings().pipe(
          tap((res) => {
            this.snackbar.open('PDF deleted successfully', 'Close', {duration: 5000});
            
            
          }),
          catchError((error) => {
            this.snackbar.open('Error deleting PDF', 'Close', {duration: 5000, panelClass: 'error-snackbar'});
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  logout(){
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }
}
