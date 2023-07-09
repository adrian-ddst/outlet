import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from '../constants/app.constants';
import { HttpRequestOptions } from '../interfaces/httpRequestOptionsInterface';
import { Observable } from 'rxjs';
import { User } from '../interfaces/userInterface';
import { CartStateImpl } from '../interfaces/cartStateInterface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient
  ) { }

  getXSRFToken(): Observable<any> {
    return this.http.get(SERVER_API_URL + "/get-XSRF-token");
  }

  getCategories(): Observable<any> {
    return this.http.get(SERVER_API_URL + "/getCategories");
  }

  getClothesNoFilter(): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/getClothes", null, options);
  }

  getProductByName(productName: string): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/getProductByName", { productName: productName }, options);
  }

  login(user: User): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/login", user, options);
  }

  silentAutoLogin(token: String): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/silentAutoLogin", { token: token }, options);
  }

  checkUserRole(token: String): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/checkUserRole", { token: token }, options);
  }

  checkUserTokenSimple(token: String): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/checkUserTokenSimple", { token: token }, options);
  }

  register(user: User): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/register", user, options);
  }

  addNewProduct(product: any): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/addNewProduct", { product: product }, options);
  }

  saveOrder(cartState: CartStateImpl, user: User, total: number, deliveryOptions: any): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/saveOrder", { cartState: cartState, user: user, total: total, deliveryOptions }, options);
  }

  getAllOrders(): Observable<any> {
    return this.http.get(SERVER_API_URL + "/getOrders");
  }

  getPaymentGateway(payload: any): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/getPaymentGateway", payload, options);
  }

  updateOrder(orderId: string, action: string): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/updateOrder", { orderId: orderId, action: action }, options);
  }

  // Debug Get method
  debugGet(): Observable<any> {
    return this.http.get(SERVER_API_URL + "/debugGet");
  }

  // Debug Post method
  debugPost(): Observable<any> {
    const options: HttpRequestOptions = {
      observe: 'body',
      responseType: 'json'
    };
    return this.http.post(SERVER_API_URL + "/debugPost", null, options);
  }

}
