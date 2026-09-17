import { Volume, User } from "types";

export interface LoanOperator {
    id: number;
    name: string;
    display_name?: string;
}

export interface Loan {
    id: number;
    loan_date: Date;
    due_date: Date;
    return_date?: Date | null;
    description?: string;

    // Quem lançou o empréstimo e quem deu baixa nele - exibido discretamente na listagem
    // administrativa. `updated_by_user` é nulo enquanto o empréstimo estiver em aberto.
    created_by_user?: LoanOperator | null;
    updated_by_user?: LoanOperator | null;

    // Presente quando este empréstimo foi criado por uma renovação (aponta para o
    // empréstimo anterior do mesmo volume/usuário que foi encerrado no mesmo instante).
    renewed_from_loan_id?: number | null;

    volume: Volume;
    user: User;
}

export type LoanState = "overdue" | "open" | "returned";

export interface LoanFilter {
    user_search?: string;
    volume_search?: string;
    state?: LoanState;
    user_id?: number | bigint;
}
