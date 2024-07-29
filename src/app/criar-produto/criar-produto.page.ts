import { Component, OnInit, ViewChild } from '@angular/core';
import { Products } from '../_models/Products';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CriarProdutoService } from './criar-produto.service';
import { SelectListItem } from '../_models/select-list-item';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import jsQR from 'jsqr';

@Component({
  selector: 'app-criar-produto',
  templateUrl: './criar-produto.page.html',
  styleUrls: ['./criar-produto.page.scss'],
})
export class CriarProdutoPage implements OnInit {
  public product: Products;
  private _unsubscribeAll: Subject<any>;
  public productForm: FormGroup;
  @ViewChild('form', { static: true }) form: FormGroup;
  imageUrl: string;
  public categoriaList: SelectListItem[];
  public unidadeList: SelectListItem[];
  public isToastOpen = false;
  isScanning: boolean = false;

  constructor(private _formBuilder: FormBuilder, private criarProdutoService: CriarProdutoService, private router: Router,
    private toastController: ToastController, private qrScanner: QRScanner, private platform: Platform, private alertController: AlertController
  ) { 
    this.product = new Products();
    this.productForm = this.createForm();
    this.form = this.productForm;

    this.platform.ready().then(() => {
      // Verifique se a plataforma está pronta antes de usar qualquer API de plataforma
    });
  }

  ngOnInit() {
    this.criarProdutoService.GetCategoryList().pipe()
      .subscribe((result) => {
        if(result.code == 1){
          this.categoriaList = result.data as SelectListItem[];
        }
      })

    this.criarProdutoService.GetUnityList().pipe()
      .subscribe((result) => {
        if(result.code == 1){
          this.unidadeList = result.data as SelectListItem[];
        }
      })
  }

  createForm(): FormGroup{
    return this._formBuilder.group({
      Name: [this.product.name ? this.product.name : '', Validators.required],
      Category: [this.product.category ? this.product.category : '', Validators.required],
      Price: [this.product.price ? this.product.price : 0, Validators.required],
      Barcode: [this.product.barcode ? this.product.barcode : '', Validators.required],
      Image: [this.product.image ? this.product.image : '', Validators.required],
      Unity: [this.product.unity ? this.product.unity : '', Validators.required],
      Inactive: [this.product.inactive ? this.product.inactive : false, Validators.required]
    })
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        this.imageUrl = `data:image/jpeg;base64,${image.base64String}`;
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  CriarProduto(isOpen: boolean){
    this.productForm.get('Image').setValue(this.imageUrl);
    this.productForm.get('Inactive').setValue(false);
    const data = this.productForm.getRawValue();
    
    this.criarProdutoService.CriarProduto(data).then((response) => {
      if(response.code == 1){
        this.productForm.markAsPristine();
        //this.setOpen(isOpen);
        //this.router.navigate(['tabs/tab3']);
        this.Toast();
      }else{
        //console.log(response.info.textMessage);
        this.ToastError(response.info.textMessage);
      }
    })
  }

  async ToastError(errorMessage: string){
    const toast = await this.toastController.create({
      message: `${errorMessage}`,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }

  async Toast() {
    const toast = await this.toastController.create({
      message: 'Produto adicionado com sucesso',
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
    this.router.navigate(['tabs/tab3']);
    // setTimeout(() => {
    //   this.router.navigate(['tabs/tab5']);
    // }, 2000);
  }





  // startScanning() {
  //   this.qrScanner.prepare()
  //     .then((status: QRScannerStatus) => {
  //       if (status.authorized) {
  //         let scanSub = this.qrScanner.scan().subscribe((text: string) => {
  //           console.log('Scanned something', text);

  //           // Stop scanning
  //           this.qrScanner.hide();
  //           scanSub.unsubscribe();

  //           // Process the scanned barcode data
  //           this.processBarcodeData(text);
  //         });

  //         // Show camera preview
  //         this.qrScanner.show();
  //       } else if (status.denied) {
  //         // Camera permission was permanently denied
  //         this.qrScanner.openSettings();
  //       } else {
  //         // Permission was denied, but not permanently. You can ask for permission again at a later time.
  //       }
  //     })
  //     .catch((e: any) => console.log('Error is', e));
  // }







  async startScanning() {
    try {
      // Check and request camera permission
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (permission.granted) {
        // Hide the background and start scanning
        BarcodeScanner.hideBackground();
        this.isScanning = true;
        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          // Process the scanned barcode data
          this.processBarcodeData(result.content);
          this.showAlert('Sucesso', `Código de barras scaned é: ${result.content}`);
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
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }












  // async startScanning() {
  //   const permission = await BarcodeScanner.checkPermission({ force: true });
  //   if (permission.granted) {
  //     BarcodeScanner.hideBackground();
  //     this.isScanning = true;
  //     const result = await BarcodeScanner.startScan();

  //     if (result.hasContent) {
  //       this.processBarcodeData(result.content);
  //       this.showAlert('Sucesso', `Código de barras scaned é: ${result.content}`);
  //     } else {
  //       this.showAlert('Erro', 'Nenhum conteúdo encontrado');
  //     }

  //     this.stopScanning();
  //   } else {
  //     this.showAlert('Erro', 'Permissão da câmera não concedida');
  //     console.error('Permissão da câmera não concedida');
  //   }
  // }

  // processBarcodeData(barcodeData: string) {
  //   this.criarProdutoService.getProductDetails(barcodeData).subscribe(
  //     (data) => {
  //       console.log('Product details:', data);
  //     },
  //     (error) => {
  //       console.error('Error fetching product details:', error);
  //     }
  //   );
  // }

  // stopScanning() {
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  //   this.isScanning = false;
  // }

  // async showAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header,
  //     message,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }

  // async takePictureBarcode() {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       resultType: CameraResultType.Base64,
  //       source: CameraSource.Camera,
  //     });

  //     if (image.base64String) {
  //       this.imageUrl = `data:image/jpeg;base64,${image.base64String}`;
  //       this.processImage(image.base64String);
  //     }
  //   } catch (error) {
  //     console.error('Error capturing image:', error);
  //     this.showAlert('Error', 'Error capturing image');
  //   }
  // }

  // processImage(base64String: string) {
  //   const image = new Image();
  //   image.src = `data:image/jpeg;base64,${base64String}`;
  //   image.onload = () => {
  //     const canvas = document.createElement('canvas');
  //     const context = canvas.getContext('2d');
  //     if (context) {
  //       canvas.width = image.width;
  //       canvas.height = image.height;
  //       context.drawImage(image, 0, 0, image.width, image.height);
  //       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  //       const code = jsQR(imageData.data, imageData.width, imageData.height);

  //       if (code) {
  //         this.showAlert('Success', `Barcode scanned: ${code.data}`);
  //       } else {
  //         this.showAlert('Error', 'No barcode found');
  //       }
  //     }
  //   };
  // }
}
