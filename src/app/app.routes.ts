import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ProductDetailComponent } from './components/productdetail/productdetail.component';
import { LayoutComponent } from './layout/layout.component';

import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './admin/products/products.component';
import { OrdersComponent } from './admin/orders/orders.component';

export const routes: Routes = [

  // ==================== WEBSITE ====================
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      }
    ]
  },

  // ==================== ADMIN ====================
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'products',
        component: AdminProductsComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      }
    ]
  },

  // ==================== WILDCARD ====================
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}