import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Products } from "../_models/Products";
import { HttpClient } from "@angular/common/http";
import { Line } from "../_models/Line";
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AddCartService implements Resolve<any>{
    private apiUrl1 = 'https://localhost:7145/api/Products';
    public cart: Line[] = [];
    public routeParams: any;
    public total = 0;

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

        this.getTotal();

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

    getTotal() {
      this.cart.forEach((line) => {
        this.total += line.price * line.qtd;
      })
      
      return this.total;
      //return this.cart.reduce((total, item) => total + item.price * item.qtd, 0);
    }
}
