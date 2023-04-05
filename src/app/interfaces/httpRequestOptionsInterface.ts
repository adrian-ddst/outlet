import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface HttpRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] },
    context ?: HttpContext | undefined; 
    observe?: 'body' | 'events' | 'response' | undefined | any,
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
    reportProgress?: boolean,
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | any,
    withCredentials?: boolean
}
