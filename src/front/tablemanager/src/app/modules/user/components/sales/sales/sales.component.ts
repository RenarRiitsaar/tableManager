import { Component, input, OnInit } from '@angular/core';
import { SalesService } from '../../../../../auth/services/sales/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sales } from '../../../../../model/Sales';
import { catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmComponent } from '../../../../../public-components/delete-confirm/delete-confirm.component';
import { StorageService } from '../../../../../auth/services/storage/storage.service';
import { SendMailComponent } from '../../send-mail/send-mail.component';
import { ScaleType } from '@swimlane/ngx-charts';
import { GroupedSale } from '../../../../../model/GroupedSale';
import { deleteSlideOut, fade, slideIn } from '../../../../../animations';



@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  animations:[
  slideIn, fade, deleteSlideOut
  ]
})


export class SalesComponent implements OnInit {
  slideStates: { [key: number]: 'in' | 'out' } = {};
  slideIn = 'out';
  sales: Sales[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';
  searchQuery: any = '';
  selectedRange: string = 'current';
  firstDay: Date = new Date();
  lastDay: Date = new Date();
  currentYear: number = new Date().getFullYear();
  lastYear: number = this.currentYear -1;
  selectedYear: number = 0;
  loaded: boolean = false;
  dailyData: { name: string, value: number, totalPrice: number, date: string}[] = [];
  monthlyData:{name: string; value: number, totalPrice: number, year: number}[] =[];
  filteredSale!: Sales | undefined;
  dailySalesList!: GroupedSale [] | undefined;
  monthlySalesList!: GroupedSale[] | undefined;

  view: [number, number] = [500, 200];
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,  
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#C6B15C']
  };

  
  
  constructor(private salesService:SalesService,
              private snackbar:MatSnackBar,
              private dialog: MatDialog
  ){}


  ngOnInit(): void {
    this.onAnimate();
   this.getSales();
  }

  onAnimate(){
    setTimeout(() => {
    this.slideIn == 'out' ? this.slideIn = "in" : this.slideIn = 'out';
  },100);

  }

  dateStringToObj(date: string){
    let parts = date.split('.');
    let dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return dateObj;
  }

  onDateRangeChange(event: Event): void {
    this.loaded = false;
    const value = (event.target as HTMLSelectElement).value;
    this.selectedRange = value;

    let startDate = new Date();
    let endDate = new Date();
    let currentYear = new Date().getFullYear();
  
    switch (value) {
      case 'current':
        startDate = new Date(this.firstDay);
        endDate = new Date(this.lastDay);
        break;
      case '-1':
        startDate = new Date(this.subtractDays(this.firstDay.toString(), 7));
        endDate = new Date(this.subtractDays(this.lastDay.toString(), 7));
        break;
      case '-2':
        startDate = new Date(this.subtractDays(this.firstDay.toString(), 14));
        endDate = new Date(this.subtractDays(this.lastDay.toString(), 14));
        break;
      case '-3':
        startDate = new Date(this.subtractDays(this.firstDay.toString(), 21));
        endDate = new Date(this.subtractDays(this.lastDay.toString(), 21));
        break;

        case 'lastYear':
          currentYear= this.currentYear -1;
          break;
          
          
    }
  
    this.dailySales(startDate.toString());
    this.monthlySales(currentYear);
    this.firstDay = new Date();
    this.lastDay = new Date();
    this.lastDay.setDate(this.lastDay.getDate() + 6);
    this.updateChartData(currentYear);

    setTimeout(()=>{
      this.loaded = true;
    }, 25);


  }

  getYear(name:string){
    const year=  this.monthlyData.find(data => data.name === name);
  
    this.selectedYear = year?.year ?? new Date().getFullYear();
    
    return year ? year.year : new Date().getFullYear();
  }

  getDate(name: string){
    const date = this.dailyData.find(data => data.name === name);
    return date ? date.date : new Date();
  }

  getTotalDailyPrice(name: string): number {
    const entry = this.dailyData.find(data => data.name === name);
    return entry ? entry.totalPrice : 0;
  }

  getTotalMonthlyPrice(name: string): number {
    const entry = this.monthlyData.find(data => data.name === name);
    return entry ? entry.totalPrice : 0;
  }

  updateChartData(getYear?: number){
    const currentYear = new Date().getFullYear();
    const yearToUse = getYear || currentYear;

    if (!this.dailySalesList || this.dailySalesList.length === 0) {
      this.dailyData = [
        { name: "Monday", value: 0, totalPrice: 0, date: ''},
        { name: "Tuesday", value: 0, totalPrice: 0, date: ''},
        { name: "Wednesday", value: 0, totalPrice: 0, date: ''},
        { name: "Thursday",value: 0, totalPrice: 0, date: ''},
        { name: "Friday", value: 0,  totalPrice: 0, date: ''},
        { name: "Saturday",value: 0,  totalPrice: 0, date: ''},
        { name: "Sunday",value: 0,  totalPrice: 0, date: ''},
      ];
    } else {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
      this.dailyData = days.map(day => {
        const salesEntry = this.dailySalesList?.find(sale => sale.day === day);
        const sales = salesEntry ? salesEntry.sales.length : 0;
  
         let totalPrice = 0;
         let saleDate;
         let dateToString = '';
        

        if(salesEntry && salesEntry.sales){
          for(let sale of salesEntry.sales){
           totalPrice += sale.totalPrice || 0;
                    
            saleDate = sale.saleDate; 
          }
          if(saleDate){
            let dateFormat = new Date(saleDate).toLocaleDateString('en-GB');
            let replaceFormat = dateFormat.replace(/\//g, '.')
            dateToString = replaceFormat.toString();
          }
        }
        return { name: day, value: sales, totalPrice: totalPrice, date: dateToString };
      });
    }

    if(!this.monthlySalesList || this.monthlySalesList.length === 0){
      this.monthlyData = [
        { name: "January", value: 0, totalPrice: 0, year: 0},
        { name: "February", value: 0, totalPrice: 0, year: 0 },
        { name: "March", value: 0, totalPrice: 0, year: 0 },
        { name: "April", value: 0, totalPrice: 0, year: 0 },
        { name: "May", value: 0, totalPrice: 0, year: 0 },
        { name: "June", value: 0, totalPrice: 0, year: 0 },
        { name: "July", value: 0, totalPrice: 0, year: 0 },
        { name: "August", value: 0, totalPrice: 0, year: 0 },
        { name: "September", value: 0, totalPrice: 0, year: 0 },
        { name: "October", value: 0, totalPrice: 0, year: 0 },
        { name: "November", value: 0, totalPrice: 0, year: 0 },
        { name: "December", value: 0, totalPrice: 0, year: 0 }
      ];
    }else{
      const months =['January', 'February','March',
                      'April', 'May','June', 
                      'July', 'August','September',
                      'October','November','December'];

    this.monthlyData = months.map(month =>{
    
      const salesEntry = this.monthlySalesList?.find(sale => sale.month === month && Number(sale.year) === yearToUse);
    
      const sales = salesEntry ? salesEntry.sales.length : 0;
     

      let totalPrice = 0;
    

      if(salesEntry && salesEntry.sales){
        for(let sale of salesEntry.sales){
         totalPrice += sale.totalPrice || 0;
        
        
        }
      }
       
      return { name: month, value: sales, totalPrice: totalPrice, year: yearToUse}; 
    });
    }
  }

  monthlySales(year?: number) {
    if (!this.sales || this.sales.length === 0) {
      this.monthlySalesList = [];
      return;
    }

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const salesByMonth: { [key: string]: { [key: number]: Sales[] } } = {};
    const filterYear = year || new Date().getFullYear();
    
    this.sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      const monthIndex = saleDate.getMonth();
      const month = months[monthIndex];
      const saleYear = saleDate.getFullYear();

      
      if(filterYear === saleYear){
      if (!salesByMonth[month]) {
        salesByMonth[month] = {};
      }
      if (!salesByMonth[month][saleYear]) {
        salesByMonth[month][saleYear] = [];
      }
      salesByMonth[month][saleYear].push(sale);
      }
    });

    
 
    
    this.monthlySalesList = Object.keys(salesByMonth).flatMap(month => {
      const salesForYear = salesByMonth[month][filterYear];
      
      if (salesForYear) {
        return [{
          month,
          year: filterYear.toString(),
          sales: salesForYear
        }];
      } else {
        return [];
      }
    });
    
  }

  dateToString(date: Date){
    let format = new Date(date).toLocaleDateString('en-GB');
    let replaceFormat = format.replace(/\//g, '.');
    let toString = replaceFormat.toString();

    return toString;
  }

  addDays(date: string, days: number){
    let parts = date.split('.');
    let dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
  }

  subtractDays(date: string, days: number) {
    let parts = date.split('.');
    let day = parts[0]
    let month = parts[1];
    let year = parts[2];

    let dateObj = new Date(`${year}-${month}-${day}`);
    dateObj.setDate(dateObj.getDate() - days);
    return dateObj;
  }

  dailySales(date?: string){
    if (!this.sales || this.sales.length === 0) {
      this.dailySalesList = [];
      return;
    }
   
    const currentDate = date ? new Date(date) : new Date();
    const startOfWeek = new Date(currentDate);
    let day = startOfWeek.getDay();
    let setMonday = (day === 0 ? -6 : 1) - day;

    
    startOfWeek.setDate(startOfWeek.getDate() + setMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    this.firstDay = startOfWeek;

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    this.lastDay = endOfWeek;
  
    const weeklySales = this.sales.filter(sale =>{
      const saleDate = new Date(sale.saleDate);
      return saleDate >= startOfWeek && saleDate <= endOfWeek;
    });

    const salesByDay: { [key: string]: any[] } = {};

    weeklySales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      const dayOfWeek = this.getDayOfWeek(saleDate);
  
      if (!salesByDay[dayOfWeek]) {
        salesByDay[dayOfWeek] = [];
      }
      
      salesByDay[dayOfWeek].push(sale);
    });
    this.dailySalesList = Object.keys(salesByDay).map(day => ({
      day,
      sales: salesByDay[day]
    }));
    
  }
  
 
  getDayOfWeek(date: Date): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }

  openSendMail(invoiceNr: number){
    this.filteredSale = this.sales.find(sale => sale.invoiceNumber === invoiceNr);
    const dialogRef = this.dialog.open(SendMailComponent,{
      width: '600px',
      height: '677px',
      data:{invoiceNr: invoiceNr,
            clientEmail: this.filteredSale?.customerEmail
      }
    });
    
  }

  downloadPdf(articleNr:number){
    const userId = StorageService.getUserId();
    
    this.salesService.downloadFile(userId, articleNr).pipe(
      tap((blob: Blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${articleNr}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.snackbar.open("PDF downloaded", 'Close', {duration:5000});
      }),
      catchError((error) =>{
        this.snackbar.open("Invoice is older than 3 months and is not stored in server anymore", 'Close', {duration:5000});
        throw error;
      })
    ).subscribe();
  }

  toggleSort(){
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
  sortByClientName(){
    this.toggleSort();

    this.sales.sort((a, b) => {
      if (a.clientName < b.clientName) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.clientName > b.clientName) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

 
  sortByInvoiceNum(){
    this.toggleSort();

    this.sales.sort((a, b) => {
      if (a.invoiceNumber < b.invoiceNumber) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a.invoiceNumber > b.invoiceNumber) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByTransactionPrice(){
    this.toggleSort();

    this.sales.sort((a,b) =>{
      if(a.totalPrice < b.totalPrice){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.totalPrice > b.totalPrice){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  }

  sortByInvoiceType(){
    this.toggleSort();

    this.sales.sort((a,b) =>{
      if(a.invoiceType < b.invoiceType){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.invoiceType > b.invoiceType){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByAddress(){
    this.toggleSort();

    this.sales.sort((a,b) =>{
      if(a.customerAddress < b.customerAddress){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.customerAddress > b.customerAddress){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByEmail(){
    this.toggleSort();

    this.sales.sort((a,b) =>{
      if(a.customerEmail < b.customerEmail){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.customerEmail > b.customerEmail){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  sortByRegNr(){
    this.toggleSort();

    this.sales.sort((a,b) =>{
      if(a.regNr < b.regNr){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.regNr > b.regNr){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sortByDate(){
    this.toggleSort();

    this.sales.sort((a,b) =>{
      if(a.saleDate < b.saleDate){
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if(a.saleDate > b.saleDate){
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


  searchSale(query:any){
    
    this.searchQuery = query;
    if(this.searchQuery.length > 0){
    
    this.sales = this.sales.filter(sale =>
      sale.invoiceNumber.toString().includes(this.searchQuery) ||
      sale.clientName.toString().toLowerCase().includes(this.searchQuery) ||
      sale.clientName.toString().includes(this.searchQuery) ||
      sale.invoiceType.toString().toLowerCase().includes(this.searchQuery) ||
      sale.invoiceType.toString().includes(this.searchQuery) ||
      sale.customerEmail.includes(this.searchQuery) ||
      sale.regNr.toString().includes(this.searchQuery) ||
      sale.saleDate.toString().includes(this.searchQuery)
    );
    }else{
    this.getSales();
     }
  }


  getSales(){
    this.salesService.getSales().pipe(
      tap((sales : Sales[]) =>{
        this.sales = sales;
        this.dailySales();
        this.monthlySales();
        this.updateChartData();
        setTimeout(()=>{
          this.loaded = true;
        }, 25);
  
       
      })
    ).subscribe();
      }

  deleteSale(sale: Sales){
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.slideStates[sale.invoiceNumber] = 'out';

        setTimeout(() =>{
        this.salesService.deleteSale(sale).pipe(
          tap(() =>{
            this.snackbar.open('Sale info deleted', 'Close', {duration: 5000});
           this.getSales();
    
          }),
          catchError((error) => {
            this.snackbar.open('Error deleting sale', 'Close', {duration : 5000, panelClass: 'error-snackbar'});
            return of(null);
          })
        ).subscribe();
      },300);
    }
    });
  }

}
