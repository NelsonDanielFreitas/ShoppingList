import { Component, OnInit, ViewChild } from '@angular/core';
import { AddCartService } from '../add-cart/add-cart.service';
import { Line } from '../_models/Line';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from '../_models/List';
import { AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Tab2Service } from './tab2.service';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  public cartItems: Line[];
  editMode = false;
  public listaForm: FormGroup;
  @ViewChild('form', { static: true }) form: FormGroup;
  public lista: List;
  private _unsubscribeAll: Subject<any>;
  token: string = '';
  total = 0;

  constructor(private cartService: AddCartService, private router: Router, private _formBuilder: FormBuilder, private alertController: AlertController,
    private tab2Service: Tab2Service, private loginService: LoginService
  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(){
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.total;
    this.lista = new List();
    this.listaForm = this.createForm();
    this.form = this.listaForm;


    
  }

  createForm(): FormGroup{
    return this._formBuilder.group({
      Name: [this.lista.name ? this.lista.name : '', Validators.required],
      Id: [this.lista.id ? this.lista.id : 0],
      Code: [this.lista.code ? this.lista.code : ''],
      State: [this.lista.state ? this.lista.state : ''],
      TotalPrice: [this.lista.totalPrice ? this.lista.totalPrice : 0],
      Username: [this.lista.username ? this.lista.username : ''],
      Date: [this.lista.date ? this.lista.date : new Date()],
      Token: [this.token ? this.token : '']
    })
  }

  IrCarrinho(){
    this.router.navigate(['/add-cart']);
  }

  Atualizar(){
    this.cartItems = this.cartService.getCartItems();
  }

  increaseQuantity(product: Line) {
    this.cartService.increaseQuantity(product);
    this.loadCart();
  }

  decreaseQuantity(product: Line) {
    this.cartService.decreaseQuantity(product);
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    //this.total = this.cartService.getTotal();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  removeFromCart(product: Line) {
    this.cartService.removeProduct2(product);
    this.loadCart(); 
  }

  async FinalizarLista(){
    if(this.cartService.cart.length == 0){
      this.presentAlert();
      return;
    }
    let name = await this.ColocarNomeLista();
    while (!name || name.trim() === '') {
      if(name == null){
        return;
      }
      name = await this.ColocarNomeLista();
    }
    this.token = this.loginService.loggedUser.token;
    this.listaForm.get('Token').setValue(this.token);
    this.listaForm.get('Name').setValue(name);
    const data = this.listaForm.getRawValue();
    data.Line = this.cartService.cart;

    this.tab2Service.NewList(data).then((response) => {
      if(response.code == 1){
        this.presentAlertSucessoIntroduzir(name);
        this.cartService.cart = [];
      }
    })

  }

  async ColocarNomeLista(): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Introduza o nome da lista',
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Nome da lista',
            value: '',
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(null);
              return null; 
            },
          },
          {
            text: 'Enviar',
            handler: (data) => {
              if (data.name && data.name.trim() !== '') {
                resolve(data.name);
                return data.name;
              } else {
                // Don't dismiss the alert if the input is empty
                return false;
              }
            },
          },
        ],
      });
  
      await alert.present();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Erro ao finalizar lista',
      message: 'É necessário introduzir linhas.',
      buttons: ['Ok'],
    });

    await alert.present();
  }

  async presentAlertSucessoIntroduzir(name: string) {
    const alert = await this.alertController.create({
      header: 'Lista criada com sucesso',
      message: `A lista foi criada com o nome "${name}"`,
      buttons: ['Ok'],
    });

    await alert.present();
  }
}
