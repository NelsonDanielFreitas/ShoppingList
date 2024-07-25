import { Component, OnInit } from '@angular/core';
import { Products } from '../_models/Products';
import { Tab3Service } from '../tab3/tab3.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AddCartService } from './add-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.page.html',
  styleUrls: ['./add-cart.page.scss'],
})
export class AddCartPage implements OnInit {
  public products: Products[];
  public safeImages: Record<number, SafeUrl> = {};


  constructor(private tab3Service: Tab3Service, private sanitizer: DomSanitizer, private addCartService: AddCartService, private router: Router) { }

  ngOnInit() {
    this.tab3Service.products$.subscribe((products) => {
      this.products = products;
      products.forEach((product) => {
        this.safeImages[product.image] = this.sanitizeImageUrl(product.image);
      });
    });
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/png;base64,${imageUrl}`
    );
  }

  addToCart(product: Products){
    console.log(product.name);
    this.addCartService.addProduct(product);
  }

  chunkedProducts(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  IrTras(){
    this.router.navigate(['/tabs/tab2']);
  }

  isProductInCart(product: Products): boolean {
    return this.addCartService.isProductInCart(product);
  }

  removeFromCart(product: Products) {
    this.addCartService.removeProduct(product);
  }
}
