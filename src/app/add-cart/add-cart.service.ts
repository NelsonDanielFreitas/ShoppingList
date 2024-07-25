import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Products } from "../_models/Products";
import { HttpClient } from "@angular/common/http";
import { Line } from "../_models/Line";


@Injectable({
  providedIn: 'root',
})
export class AddCartService implements Resolve<any>{
    private apiUrl1 = 'https://localhost:7145/api/Products';
    private cart: Line[] = [];
    public routeParams: any;


    constructor(private http: HttpClient) {
    }
    
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
        Promise.all([this.getCartItems()]).then(() => {
            resolve(null);
        }, reject);
        });
    }
    addProduct(product: Products) {
        const index = this.cart.findIndex(item => item.productName === product.name);
        if (index > -1) {
          this.cart[index].qtd += 1;
        } else {
          const line: Line = {
            id: -1,
            code: '',
            codeLine: '',
            totalPrice: 0,
            productName: product.name,
            price: product.price,
            barcode: product.barcode,
            qtd: 1
          };
          this.cart.push(line);
        }

    }

    getCartItems() {
        console.log("Avec");
        return this.cart;
    }
    
    isProductInCart(product: Products): boolean {
        return this.cart.some(item => item.productName === product.name);
    }

    removeProduct(product: Products) {
        const index = this.cart.findIndex(item => item.productName === product.name);
        if (index > -1) {
          this.cart.splice(index, 1);
        }
    }

    removeProduct2(product: Line) {
        const index = this.cart.findIndex(item => item.productName === product.productName);
        if (index > -1) {
          this.cart.splice(index, 1);
        }
    }

    increaseQuantity(product: Line) {
        const index = this.cart.findIndex(item => item.productName === product.productName);
        if (index > -1) {
          this.cart[index].qtd += 1;
        }
    }
    
    decreaseQuantity(product: Line) {
        const index = this.cart.findIndex(item => item.productName === product.productName);
        if (index > -1 && this.cart[index].qtd > 1) {
          this.cart[index].qtd -= 1;
        }
    }
}
