import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, delay, interval } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
    private httpLoading$ = new ReplaySubject<boolean>(1);

    constructor() { }

    httpProgress(): Observable<boolean> {
        return this.httpLoading$.asObservable();
    }

    setHttpProgressStatus(inprogess: boolean) {
        this.httpLoading$.next(inprogess);
    }
}
