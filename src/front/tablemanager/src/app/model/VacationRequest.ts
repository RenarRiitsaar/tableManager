export interface VacationRequest{
    id: number;
    employeeId: number;
    startDate: Date;
    endDate: Date;
    comment: string;
    creationDate: Date;
    userId: number;
    vacationType: string;
}