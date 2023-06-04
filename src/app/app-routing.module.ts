import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseOneComponent } from './pages/choose-one/choose-one.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChooseOneSpecificComponent } from './pages/choose-one-specific/choose-one-specific.component';
import { AccountComponent } from './pages/account/account.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { AccountGuard } from './guards/account.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'choose-one/:category', component: ChooseOneComponent },
  { path: 'choose-one/:category/specific/:specificCategory', component: ChooseOneSpecificComponent },
  { path: 'choose-one/:category/specific/:specificCategory/:productName', component: ProductPageComponent },
  { path: 'account', component: AccountComponent, canActivate: [() => inject(AccountGuard).canActivate()] },
  { path: 'admin', component: AdminComponent, canActivate: [() => inject(AdminGuard).canActivate()] },
  { path: 'checkout', component: CheckoutComponent },
  // 404 routes
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
