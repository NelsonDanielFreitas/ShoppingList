import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriarProdutoPage } from './criar-produto.page';

const routes: Routes = [
  {
    path: '',
    component: CriarProdutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriarProdutoPageRoutingModule {}
