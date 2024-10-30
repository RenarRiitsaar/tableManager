export interface Employee{
    id:number;
    name: string;
    photoURL: string;
    email: string;
    phone: string;
    iban: string;
    days?: number;
    customSchedule: boolean;
    salary: number;
    contractStartDate: Date;
    payType: string;

}