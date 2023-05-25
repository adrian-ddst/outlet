import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req;
        let token = this.tokenExtractor.getToken();
        console.warn('Extracted token -> ', token);
        if (token !== null) {
            requestToForward = req.clone({ setHeaders: { "X-XSRF-TOKEN": token } });
        }
        return next.handle(requestToForward);
    }
}
