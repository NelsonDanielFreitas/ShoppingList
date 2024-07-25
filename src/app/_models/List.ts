import { DatePipe } from "@angular/common";

export class List{
    id: number;
    code: string;
    name: string;
    state: string;
    totalPrice: number;
    username: string;
    date: Date;

    constructor(){
        this.id = -1;
        this.code = "";
        this.name = "";
        this.state = "";
        this.totalPrice = 0;
        this.username = "";
        this.date = new Date();
    }
}