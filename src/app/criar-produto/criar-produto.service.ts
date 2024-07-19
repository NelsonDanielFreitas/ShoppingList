import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Products } from "../_models/Products";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root',
})
export class CriarProdutoService  {
    private apiUrl1 = 'https://localhost:7145/api/Products'
    
    constructor(private http: HttpClient) {
    }
    CriarProduto(produto): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl1}/CriarProduto`, produto)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        })
    }
}
