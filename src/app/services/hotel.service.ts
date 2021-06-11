import { Hotel } from './../interfaces/hotel';
import { Price } from '../interfaces/price';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import {catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

    private hotels : string = "https://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo";
    private currencies = [
      {"USD": "http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/USD"},
      {"SGD": "http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/SGD"},
      {"CNY": "http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/CNY"},
      {"KRW": "http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/KRW"},
    ]; 

    constructor(private http : HttpClient) { }

    //get hotel api
    getHotels(): Observable<Hotel[]>{
      return this.http.get<Hotel[]>(this.hotels).pipe(catchError(this.errorHandler));
    }

    //get price api
    getPricings(currency : string): Observable<Price[]> {
      for(let i in this.currencies){
        if(this.currencies[i].hasOwnProperty(currency)){
          return this.http.get<Price[]>(this.currencies[i][currency]).pipe(catchError(this.errorHandler));
        }
      }
    }

    //joins hotel and price api request
    getHotelWithPricing(currency : string){
      const hotels = this.getHotels();
      let prices = this.getPricings(currency);

      return forkJoin([hotels,prices]).pipe(catchError(this.errorHandler));
    }

    //error handler
    errorHandler(error : HttpErrorResponse){
      return throwError(error.message || "Server Error");
    }
}
