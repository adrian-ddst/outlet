import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChooseOneComponent } from './pages/choose-one/choose-one.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChooseOneSpecificComponent } from './pages/choose-one-specific/choose-one-specific.component';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './interceptors/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptors/SpinnerInterceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AccountComponent } from './pages/account/account.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { XsrfInterceptor } from './interceptors/XsrfInterceptor';
import { CheckoutComponent } from './pages/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    ChooseOneComponent,
    NotFoundComponent,
    MainPageComponent,
    ChooseOneSpecificComponent,
    SpinnerComponent,
    AccountComponent,
    ProductPageComponent,
    AdminComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
