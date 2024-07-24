import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Products } from "../_models/Products";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root',
})
export class CriarProdutoService  {
    private apiUrl1 = 'https://localhost:7145/api/Products'
    
    constructor(private http: HttpClient) {
    }
    //Pedido para fazer a criação do produto
    CriarProduto(produto): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl1}/CriarProduto`, produto)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        })
    }

    //Pedido para ir buscar as categorias dos produtos
    GetCategoryList(){
        return this.http.get<any>(`${this.apiUrl1}/GetCategoryList`)
            .pipe(map((response) => {
                return response;
            }))
    }

    //Pedido para ir buscar as unidades dos produtos
    GetUnityList(){
        return this.http.get<any>(`${this.apiUrl1}/GetUnityList`)
            .pipe(map((response) => {
                return response;
            }))
    }
}
