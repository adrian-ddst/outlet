import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseOneComponent } from './pages/choose-one/choose-one.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChooseOneSpecificComponent } from './pages/choose-one-specific/choose-one-specific.component';
import { AccountComponent } from './pages/account/account.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'choose-one/:category', component: ChooseOneComponent },
  { path: 'choose-one/:category/specific/:specificCategory', component: ChooseOneSpecificComponent },
  { path: 'account', component: AccountComponent },
  // 404 routes
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
