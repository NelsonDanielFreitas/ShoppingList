import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriarProdutoPageRoutingModule } from './criar-produto-routing.module';

import { CriarProdutoPage } from './criar-produto.page';
import { QRScanner } from '@ionic-native/qr-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriarProdutoPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CriarProdutoPage]
})
export class CriarProdutoPageModule {}
