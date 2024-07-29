import { Component, OnInit } from '@angular/core';
import { Products } from '../_models/Products';
import { Tab3Service } from './tab3.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { CriarProdutoService } from '../criar-produto/criar-produto.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  public products: Products[];
  public safeImages: Record<number, SafeUrl> = {};
  isScanning: boolean = false;

  constructor(private tab3Service: Tab3Service, private sanitizer: DomSanitizer, private router: Router, private alertController: AlertController, private criarProdutoService: CriarProdutoService) {}

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

  async startScanning() {
    try {
      // Check and request camera permission
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (permission.granted) {
        // Hide the background and start scanning
        BarcodeScanner.hideBackground();
        this.isScanning = true;
        document.body.classList.add('scanner-active'); // Add class to body to hide other content

        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          // Process the scanned barcode data
          this.processBarcodeData(result.content);
          this.showAlert('Sucesso', `Código de barras scaneado é: ${result.content}`);
        } else {
          this.showAlert('Erro', 'Nenhum conteúdo encontrado');
        }

        // Stop scanning and show the background again
        this.stopScanning();
      } else {
        this.showAlert('Erro', 'Permissão da câmera não concedida');
        console.error('Permissão da câmera não concedida');
      }
    } catch (error) {
      console.error('Erro durante a digitalização de código de barras', error);
      this.showAlert('Erro', 'Ocorreu um erro durante a digitalização');
      this.stopScanning();
    }
  }

  processBarcodeData(barcodeData: string) {
    this.criarProdutoService.getProductDetails(barcodeData).subscribe(
      (data) => {
        console.log('Detalhes do produto:', data);
        // Handle the product details
      },
      (error) => {
        console.error('Erro ao buscar detalhes do produto:', error);
      }
    );
  }

  stopScanning() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.isScanning = false;
    document.body.classList.remove('scanner-active'); // Remove class from body
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
