import { Component } from '@angular/core';
import { Products } from '../_models/Products';
import { Tab3Service } from './tab3.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  products: Products[];
  public safeImages: Record<number, SafeUrl> = {};

  constructor(private tab3Service: Tab3Service, private sanitizer: DomSanitizer,) {}

  async ngOnInit() {
    this.tab3Service.products$.subscribe((products) => {
      this.products = products;
      products.forEach((product) => {
        this.safeImages[product.Image] = this.sanitizeImageUrl(product.Image);
      })
    })
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/png;base64,${imageUrl}`
    );
  }
}
