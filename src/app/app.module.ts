import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChooseOneComponent } from './pages/choose-one/choose-one.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChooseOneSpecificComponent } from './pages/choose-one-specific/choose-one-specific.component';

@NgModule({
  declarations: [
    AppComponent,
    ChooseOneComponent,
    NotFoundComponent,
    MainPageComponent,
    ChooseOneSpecificComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
