import { User } from "./User";

    export interface Tickets{

        id: number;
        message: String;
        user: User;
        status: boolean;
        answer: string;
    }