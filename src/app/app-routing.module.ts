import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseOneComponent } from './pages/choose-one/choose-one.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'choose-one/:category', component: ChooseOneComponent },
  // 404 routes
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
