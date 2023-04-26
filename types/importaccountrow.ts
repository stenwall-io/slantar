import { AccountRow } from "./gql";

export type ImportAccountRow = {
    date: string,
    text: string,
    amount: number,
    year: number,
    month: number,
    matching: AccountRow[],
    save: boolean,
    duplicate: boolean
}