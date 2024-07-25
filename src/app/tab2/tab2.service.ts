import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Line } from "../_models/Line";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class Tab2Service {
    private apiUrl1 = 'https://localhost:7145/api/List';
    public routeParams: any;
  
  
    constructor(private http: HttpClient) {
    }

    NewList(list): Promise<any>{
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl1}/NewList`, list)
                .subscribe((response: any) => {
                    resolve(response)
                }, reject);
        });
    }
}
      