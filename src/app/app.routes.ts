import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; 
import { ProductDetailComponent } from './components/productdetail/productdetail.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // LayoutComponent làm khung chung (Header + Footer)
    children: [
      { path: '', component: HomeComponent }, // Trang chủ nằm bên trong Layout
      { path: 'product/:id', component: ProductDetailComponent } // Trang chi tiết cũng nằm trong Layout
    ]
  },

  // Wildcard route chuyển về trang chủ nếu nhập sai URL (luôn đặt ở cuối)
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }