import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { Tab3Service } from './tab3/tab3.service';

const routes: Routes = [
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'criar-conta',
    loadChildren: () => import('./criar-conta/criar-conta.module').then( m => m.CriarContaPageModule)
  },

  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
      },
      {
        path: 'criarProduto',
        canActivate: [AuthGuard],
        loadChildren: () => import('./criar-produto/criar-produto.module').then( m => m.CriarProdutoPageModule)
      },
      {
        path: 'editar-produto',
        canActivate: [AuthGuard],
        loadChildren: () => import('./editar-produto/editar-produto.module').then( m => m.EditarProdutoPageModule)
      },
      {
        path: 'add-cart',
        canActivate: [AuthGuard],
        resolve: {
          data: Tab3Service,
        },
        loadChildren: () => import('./add-cart/add-cart.module').then( m => m.AddCartPageModule)
      },
    ]
  },
  
 
  
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
