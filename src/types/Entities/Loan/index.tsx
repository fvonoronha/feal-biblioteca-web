import { Volume, User } from "types";

export interface Loan {
    id: number;
    loan_date: Date;
    due_date: Date;
    return_date: Date;
    description: string;

    volume: Volume;
    user: User;
}
