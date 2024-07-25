import { Component, OnInit } from '@angular/core';
import { AddCartService } from '../add-cart/add-cart.service';
import { Line } from '../_models/Line';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  public cartItems: Line[];
  editMode = false;

  constructor(private cartService: AddCartService, private router: Router) {}

  ngOnInit(){
    this.cartItems = this.cartService.getCartItems();
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

}
