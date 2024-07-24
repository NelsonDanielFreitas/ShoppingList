import { DatePipe } from "@angular/common";

export class List{
    id: number;
    code: string;
    name: string;
    state: string;
    totalPrice: number;
    username: string;
    date: DatePipe;
}