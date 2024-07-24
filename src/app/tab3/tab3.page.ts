import { Component, OnInit } from '@angular/core';
import { Products } from '../_models/Products';
import { Tab3Service } from './tab3.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  public products: Products[];
  public safeImages: Record<number, SafeUrl> = {};

  constructor(private tab3Service: Tab3Service, private sanitizer: DomSanitizer, private router: Router) {}

  async ngOnInit() {
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

  CriarProduto(){
    this.router.navigate(['criarProduto']);
  }

  EditarProduto(produto: Products){
    let navigationsExtra: NavigationExtras = {
      state: {
        dadosProduto: produto
      },
    };
    this.router.navigate(['/editar-produto'], navigationsExtra);
  }
}
