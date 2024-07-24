import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../_models/Products';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SelectListItem } from '../_models/select-list-item';
import { Tab3Service } from '../tab3/tab3.service';
import { CriarProdutoService } from '../criar-produto/criar-produto.service';
import { LoginService } from '../_services/login.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.page.html',
  styleUrls: ['./editar-produto.page.scss'],
})
export class EditarProdutoPage implements OnInit {
  public produto: Products;
  public safeImages: Record<number, SafeUrl> = {};
  public produtoForm: FormGroup;
  @ViewChild('form', { static: true }) form: FormGroup;
  image: string;
  public MudouFoto: string = 'Nao';
  public categoriaList: SelectListItem[];
  public unidadeList: SelectListItem[];
  token: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer, private criarProdutoService: CriarProdutoService,
    private _formBuilder: FormBuilder, private loginService: LoginService, private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.produto = this.router.getCurrentNavigation().extras.state?.dadosProduto;
      this.safeImages[this.produto.image] = this.sanitizeImageUrl(
        this.produto.image
      );
    })
    this.produtoForm = this.createForm();
    this.form = this.produtoForm;
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

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        this.image = `data:image/jpeg;base64,${image.base64String}`;
        this.safeImages[this.produto.image] = null;
        this.MudouFoto = 'Sim';
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/png;base64,${imageUrl}`
    );
  }


  createForm(): FormGroup{
    return this._formBuilder.group({
      Name: [this.produto.name ? this.produto.name : '', Validators.required],
      Category: [this.produto.category ? this.produto.category : '', Validators.required],
      Price: [this.produto.price ? this.produto.price : 0, Validators.required],
      Barcode: [this.produto.barcode ? this.produto.barcode : '', Validators.required],
      Image: [this.produto.image ? this.produto.image : '', Validators.required],
      Unity: [this.produto.unity ? this.produto.unity : '', Validators.required],
      Inactive: [this.produto.inactive ? this.produto.inactive : false, Validators.required],
      Id: [this.produto.id ? this.produto.id : -1],
      Token: [this.token ? this.token: '']
    })
  }

  EditarProduto(){
    if (this.MudouFoto == 'Sim') {
      this.produtoForm.get('Image').setValue(this.image);
    } else {
      this.produto.image = `data:image/jpeg;base64,${this.produto.image}`;
      this.produtoForm.get('Image').setValue(this.produto.image);
    }
    this.token = this.loginService.loggedUser.token;
    this.produtoForm.get('Token').setValue(this.token);
    this.produtoForm.get('Id').setValue(this.produto.id);

    const data = this.produtoForm.getRawValue();

    this.criarProdutoService.EditProduct(data).then((response) => {
      if(response.code == 1){
        this.produtoForm.markAsPristine();
        this.Toast();
      }else{
        this.produtoForm.markAsPristine();
        this.ErrorToast(response.info.textMessage);
      }
    })
  }

  async ErrorToast(errorMessage: string){
    const toast = await this.toastController.create({
      message: `${errorMessage}`,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }

  async Toast(){
    const toast = await this.toastController.create({
      message: 'Produto editado com sucesso',
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
    this.router.navigate(['tabs/tab3']);
  }

  async EliminarProduto(){
    this.produtoForm.get('Id').setValue(this.produto.id);
    this.criarProdutoService.DeleteProductStruct.Id = this.produto.id;
    this.token = this.loginService.loggedUser.token;
    this.criarProdutoService.DeleteProductStruct.Token = this.token;

    this.criarProdutoService.DeleteProduct().then(async (response) => {
      if(response.code == 1){
        this.criarProdutoService.DeleteProductStruct.Id = 0;
        this.criarProdutoService.DeleteProductStruct.Token = '';
        const toast = await this.toastController.create({
          message: 'Produto eliminado com sucesso',
          duration: 2000,
          position: 'bottom',
        });
    
        await toast.present();
        this.router.navigate(['tabs/tab3']);
      }else{
        this.ErrorToast(response.info.textMessage);
      }
    });

  }

  setResult(ev) {
    console.log(`Dismissed with role: ${ev.detail.role}`);

    if (ev.detail.role === 'confirm') {
      this.EliminarProduto();
    }
  }

  public alertButtons2 = [
    {
      text: 'Não',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Sim',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];
}
