import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable } from 'rxjs';
import { Employee } from '../../../model/Employee';
import { StorageService } from '../storage/storage.service';

const BASE_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  uploadFile(file : File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(BASE_URL + "/api/employee/upload", formData, {
      headers: this.authHeader()
    });
  }

  deletePhoto(photo: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/api/employee/EmployeePhoto/${photo}`, {
      headers: this.authHeader()
    }).pipe(
      catchError((error) =>{
        console.error("Error getting vacation days: " + error);
        throw error;
      })
    );
  }


  getVacationDaysByEmployeeId(empId:number, year:number):Observable<any>{
    return this.http.get(BASE_URL + `/api/employee/${empId}/${year}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error getting vacation days: " + error);
        throw error;
      })
    );
  }

  getAllEmployees(): Observable<Employee[]>{
    return this.http.get<Employee[]>(BASE_URL + '/api/employee/all',
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error getting employees: " + error);
        throw error;
      })
    );
  }

  getEmployeeById(employeeId: number): Observable<any>{
    return this.http.get(BASE_URL + `/api/employee/${employeeId}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error getting employee by ID: " + error);
        throw error;
      })
    );
  }

  addEmployee(employee: any): Observable<any>{
    return this.http.post(BASE_URL + '/api/employee', employee,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Error adding an employee " + error);
        throw error;
      })
    );
  }

  updateEmployee(employee: any): Observable<any>{
    return this.http.put(BASE_URL + `/api/employee/${employee.id}`, employee,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Cannot update employee: " + error);
        throw error;
      })
    );
  }
  deleteEmployee(employeeId: number): Observable<any>{
    return this.http.delete(BASE_URL + `/api/employee/${employeeId}`,
      {headers: this.authHeader()}
    ).pipe(
      catchError((error) =>{
        console.error("Cannot delete employee: " + error);
        throw error;
      })
    );
  }
  private authHeader() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
