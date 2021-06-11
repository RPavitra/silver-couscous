import { CookieService } from 'ngx-cookie-service';
import { HotelPrice } from '../interfaces/hotel-price';
import { Hotel } from './../interfaces/hotel';
import { HotelService } from './../services/hotel.service';
import { Component, OnInit } from '@angular/core';
import { CompetitorArray, Price, CompetitorObject } from '../interfaces/price';


@Component({
    selector: 'app-hotel',
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
    currency : string;
    our_name : string = 'Awesome Us';
    currency_cookie_name : string = 'currency_type';
    currencies: Array<String> = ["USD","SGD","CNY","KRW"];

    apiHotelData : Hotel[];
    apiPriceData : Price[] ;
    displayData : HotelPrice[];

    constructor(private hotelService : HotelService, private cookieService : CookieService) {
    }

    ngOnInit(): void {
      this.callApi();
    }

    // get api
    callApi(){
      this.hotelService.getHotelWithPricing(this.getCurrency()).subscribe(([hotel,price])=>{
        this.apiHotelData = hotel;
        this.apiPriceData = price;
        this.convertPriceData();
        this.combineHotelAndPrice();
      },(error)=>{
        console.log(error);
      });
    }

    // combining results
    combineHotelAndPrice(): HotelPrice[]{
      this.displayData = [];

      for(let hotel in this.apiHotelData){
        let counter = 0;

        for(let price in this.apiPriceData){
          //push data if both hotel and currency data exists
          if(this.apiHotelData[hotel].id === this.apiPriceData[price].id){
            
            this.displayData.push({
              hotel_detail: this.apiHotelData[hotel],
              currency_detail: this.apiPriceData[price],
              order: 1
            });

            counter++;
            break;
          }
        }

        //push data where only hotel data exists
        if(counter == 0){
          this.displayData.push({
            hotel_detail: this.apiHotelData[hotel],
            order: 0
          });
        }
      }
      //sorting data based on order (1 to 0)
      return this.displayData.sort((a,b)=>(b.order - a.order));
    }

    //changing price data details
    convertPriceData() 
    {
      for (var i in this.apiPriceData) 
      {
          let hasPrice = this.apiPriceData[i].hasOwnProperty('price'); //check if price exits
          let hasCompetitor = this.apiPriceData[i].hasOwnProperty('competitors'); // check if competitors exists
          let hasTax = this.apiPriceData[i].hasOwnProperty('taxes_and_fees');
          let competitors : CompetitorArray | CompetitorObject = this.apiPriceData[i]['competitors']; // getting competitors array for specific hotel
          
          //if has price
          if(hasPrice)
          {

            this.apiPriceData[i].price = this.roundOff(this.apiPriceData[i].price);
            
            // if has tax
            if(hasTax)
            {
              this.apiPriceData[i].taxes_and_fees.tax = this.roundOff(this.apiPriceData[i].taxes_and_fees.tax);
              this.apiPriceData[i].taxes_and_fees.hotel_fees = this.roundOff(this.apiPriceData[i].taxes_and_fees.hotel_fees);
            }

            // if has competitors
            if(hasCompetitor)
            {

                for (let price in competitors)
                {  
                  competitors[price] = this.roundOff(competitors[price]);
                }
  
                // adding our price into competitor list
                competitors[this.our_name] = this.apiPriceData[i].price;
                
                // sorting price
                competitors = this.sortPricing(competitors as CompetitorObject);
                this.apiPriceData[i].competitors = competitors;
  
                // calculate saving percentage
                this.calculateAllSavings(competitors as CompetitorArray, parseInt(i));
  
                // most expensive price for strikethrough
                this.topCompetitorPrice(competitors as CompetitorArray, parseInt(i));
            }
          }

      }
    }

    //calculates save % for all subsequent higher price
    calculateAllSavings(competitors : CompetitorArray, i : number){
      //finding index of our price in competitors array
      let next_price_index = (competitors as CompetitorArray).findIndex((item)=>{
          return item.price > this.apiPriceData[i].price;
      });

      //if index returned and then calculate savings 
      while(next_price_index !== -1 && next_price_index < competitors.length){
        let savings = (((competitors[next_price_index]['price'] - (this.apiPriceData[i].price as number))/competitors[next_price_index]['price']));
        competitors[next_price_index]['higher'] = parseFloat(savings.toPrecision(3));
        next_price_index += 1;
        
        //if last index, add to savings percentage
        if(next_price_index == competitors.length)
        {
          this.apiPriceData[i].savings = parseFloat(savings.toPrecision(3));                
        }
      }      
    }    

    // check if cookie with currency set
    getCurrency(): string{
      if(this.cookieService.check(this.currency_cookie_name)){
        return this.currency = this.cookieService.get(this.currency_cookie_name);
      }else{
        return this.currency = 'USD';
      }
    }

    //rounding off based on currency
    roundOff(price : number): number{
      let is_currency_rounded_off_by_nearest_dollar = [
        this.currency == 'USD',
        this.currency == 'SGD',
        this.currency == 'CNY'
      ];
       
      let is_currency_rounded_off_by_nearest_hundread_dollar = [
        this.currency == 'KRW',
        this.currency == 'JPY',
        this.currency == 'IDR'
      ];
      
      if (is_currency_rounded_off_by_nearest_hundread_dollar.includes(true)) 
      {
        return Math.round(price / 100) * 100;
      }
      else if(is_currency_rounded_off_by_nearest_dollar.includes(true))
      {
        return Math.round(price);
      }
    }

    //sorting competitor prices
    sortPricing(competitors : CompetitorObject) :  CompetitorArray{
      return Object.entries(competitors)
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ name: k, price: v }));
    }

    //change currency
    switchCurrency(currency : string){
      if(this.currencies.includes(currency))
      {
        this.cookieService.set(this.currency_cookie_name,currency);
        this.callApi();
      } 
    }

    //get most expensive price
    topCompetitorPrice(competitors : CompetitorArray, i : number){
      let max_price_index = competitors.length - 1;
      if(competitors[max_price_index]['name'] != this.our_name){
        this.apiPriceData[i].most_expensive = competitors[max_price_index]['price'];
      }
    }

}
