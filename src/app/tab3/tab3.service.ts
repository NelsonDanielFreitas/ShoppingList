import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Products } from "../_models/Products";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root',
})
export class Tab3Service implements Resolve<any> {
    private apiUrl1 = 'https://localhost:7145/api/Products'
    public routeParams: any;
    onProductsChanged: BehaviorSubject<any>;
    public productsSubject = new BehaviorSubject<Products[]>([]);
    products$ = this.productsSubject.asObservable();
    public products: Products[];
    constructor(private http: HttpClient) {
        this.onProductsChanged = new BehaviorSubject({});
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
        Promise.all([this.getProductsList()]).then(() => {
            resolve(null);
        }, reject);
        });
    }

    async getProductsList(){
      this.http.post<any>(`${this.apiUrl1}/GetProductsList`, {})
      .subscribe((response) => {
        if(response.code == 1){
            
            const products = response.data as Products[];
            this.products = products;
            console.log(products);
            this.productsSubject.next(products);
        }
      })  
    }

}
