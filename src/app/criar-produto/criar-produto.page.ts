import { Component, OnInit, ViewChild } from '@angular/core';
import { Products } from '../_models/Products';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CriarProdutoService } from './criar-produto.service';
import { SelectListItem } from '../_models/select-list-item';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  constructor(private _formBuilder: FormBuilder, private criarProdutoService: CriarProdutoService, private router: Router,
    private toastController: ToastController,
  ) { 
    this.product = new Products();
    this.productForm = this.createForm();
    this.form = this.productForm;
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
      }
    })
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
}
