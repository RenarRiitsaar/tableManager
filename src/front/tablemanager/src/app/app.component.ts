import { TicketsService } from './auth/services/tickets/tickets.service';
import { UserService } from './auth/services/user/user.service';
import { PdfSettings } from './model/PdfSettings';
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
import { EditUserComponent } from './modules/user/components/userProfile/edit-user/edit-user.component';
import { Tickets } from './model/Tickets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAdminLoggedIn: boolean = StorageService.isAdmin();
  isUserLoggedIn: boolean = StorageService.isUser();
  isEnabled: boolean = StorageService.getStatus();
  pdfList: PdfSettings[] = [];
  hasPdf: boolean = false;
  

  constructor(private router: Router,
              private authService: AuthService,
              private dialog:MatDialog,
              private pdfSettings: PdfsettingsService,
              private snackbar: MatSnackBar,
              private userService: UserService,
              private ticketsService: TicketsService
  ) {}

  ngOnInit(){
    this.router.events.subscribe(event => {
      this.isAdminLoggedIn = StorageService.isAdmin();
      this.isUserLoggedIn = StorageService.isUser();
      this.isEnabled = StorageService.getStatus();

      if(this.isUserLoggedIn && this.isEnabled){
      this.hasPDF();
      }
    });
  }

  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  @HostListener('window:click')
  @HostListener('window:touchstart')
  resetLogoutTimer(): void {
    this.authService.startLogoutTimer();
  }

  deleteUser(){
  
   const dialogRef = this.dialog.open(DeleteConfirmComponent);

   let tickets: Tickets[] = [];

   this.ticketsService.findByUserId(StorageService.getUserId()).subscribe(( data : Tickets[]) => 
    tickets = data);
   
   dialogRef.afterClosed().subscribe(res =>{
   

    if(res){

      for(let tic of tickets){
        if(tic.user.id == StorageService.getUserId()){
          this.ticketsService.deleteTicket(tic.id).subscribe();
        }
      }

      this.pdfSettings.deleteSettings().subscribe();
      
      this.userService.deleteUser().pipe(
        tap(()=> {
        
         
          this.snackbar.open("Account deleted.", 'Close', {duration:5000});
          StorageService.logout();
          this.router.navigateByUrl('/');
        }),
        catchError((error) =>{
          console.error(error);
          this.snackbar.open("Error deleting account!", 'Close', {duration:5000});
          throw error;
        })
      ).subscribe();
    }
   })
  }

  editUser(){
    const dialogRef = this.dialog.open(EditUserComponent,
      {width:'400px'}
    )
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
      
    })
  }

  hasPDF(){
    
    this.pdfSettings.getPdfSettings().pipe(
      tap((pdf) =>{
        if(pdf && pdf.id != null){
          this.hasPdf = true;
        }else{
          this.hasPdf = false;
        }
      })
    ).subscribe();
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
