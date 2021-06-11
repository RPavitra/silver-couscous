import { CompetitorArray, CompetitorObject } from './../interfaces/price';
import { HotelPrice } from './../interfaces/hotel-price';
import { HotelService } from './../services/hotel.service';
import { of } from 'rxjs/internal/observable/of';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { HotelComponent } from './hotel.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Hotel } from '../interfaces/hotel';
import { Price } from '../interfaces/price';

describe('HotelComponent', () => {

  let component: HotelComponent;
  let fixture: ComponentFixture<HotelComponent>;
  let service: HotelService;
  let cookie;

  let error = [{status:404}];
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelComponent ],
      imports: [
        HttpClientTestingModule
      ],
      providers:[CookieService],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    service = TestBed.inject(HotelService);
    cookie = TestBed.inject(CookieService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // callapi() with success
  it('should be able to callApi',()=>{
    const mock_hotels : Hotel[] = [
      {"id": 1,"name": "Shinagawa Prince Hotel","rating": 7.7,"stars": 4,"address": "108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan","photo": "https://d2ey9sqrvkqdfs.cloudfront.net/ZqSQ/i1_t.jpg","description": "<p>Boasting 15 food and beverage options, 2 swimming pools, and its own aquarium, Prince Hotel is right next to JR Shinagawa Train Station, from where Haneda Airport is only a 25-minute train ride away. This 39-storey hotel offers beautiful Tokyo views and free WiFi throughout the entire hotel.</p>"},
      {"id": 2,"name": "Ritz Carlton Tokyo Hotel","rating": 9.1,"stars": 5,"address": "107-6245 Tokyo Prefecture, Minato-ku, Akasaka 9-7-1 Tokyo Midtown, Japan","photo": "https://d2ey9sqrvkqdfs.cloudfront.net/NXnQ/i12_m.jpg","description": "p>Located at the heart of the downtown Roppongi area in Tokyo's tallest building, the 53rd-storey Ritz-Carlton offers elegant luxury high above Tokyo’s busy streets. It features an indoor pool and 8 dining options. Free WiFi is available throughout the hotel.</p>"},
      {"id": 3,"name": "Park Hyatt Tokyo","rating":9.2,"stars":5,"address":"163-1055 Tokyo Prefecture, Shinjuku-ku, Nishishinjuku 3-7-1-2, Japan","photo":"https://d2ey9sqrvkqdfs.cloudfront.net/VuLE/i1_m.jpg","description":"<p>High above Shinjuku’s lively streets, the wide windows of Park Hyatt Tokyo’s spacious rooms offer beautiful views of Mount Fuji or Shinjuku. An indoor pool and 52nd-floor restaurant are featured.</p> <br> <p>Rooms at the Tokyo Park Hyatt boast Hokkaido wood panelling and Egyptian cotton sheets."}
    ];
    const mock_prices : Price[] = [
      {"id": 2,"price": 1234,"competitors": {"Kayak": 1920,"Booking.com": 1363},"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}},
      {"id": 3,"price": 164,"competitors": {"Traveloka": 190,"Expedia": 163},"taxes_and_fees": {"tax": 13.12,"hotel_fees": 16.40}}
    ];

    spyOn(component,'callApi').and.callFake(()=>{
      component.apiHotelData = mock_hotels;
      component.apiPriceData = mock_prices;
      spyOn(component,'convertPriceData').and.stub;
      spyOn(component,'combineHotelAndPrice').and.stub;
      return of([mock_hotels,mock_prices]);
    });
    component.callApi();
    expect(component.apiHotelData).toEqual(mock_hotels);
    expect(component.apiPriceData).toEqual(mock_prices);
    expect(component.apiPriceData.length).toBe(2);
    expect(component.apiHotelData.length).toBe(3);
  });

  //callapi() with error
  it('should log error to callApi',()=>{
    spyOn(service,'getHotelWithPricing').and.throwError('Server Error');
    spyOn(component,'callApi').and.callFake(()=>{
      expect(error).toBeDefined('Server Error');
    });
    component.callApi();
    expect(component.apiHotelData).toBeUndefined;
    expect(component.apiPriceData).toBeUndefined;
  });

  //combineHotelAndPrice()
  it('should combine hotel price api data as one',()=>{
    const mock_hotels : Hotel[] = [
      {"id": 1,"name": "Shinagawa Prince Hotel","rating": 7.7,"stars": 4,"address": "108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan","photo": "https://d2ey9sqrvkqdfs.cloudfront.net/ZqSQ/i1_t.jpg","description": "<p>Boasting 15 food and beverage options, 2 swimming pools, and its own aquarium, Prince Hotel is right next to JR Shinagawa Train Station, from where Haneda Airport is only a 25-minute train ride away. This 39-storey hotel offers beautiful Tokyo views and free WiFi throughout the entire hotel.</p>"},
      {"id": 2,"name": "Ritz Carlton Tokyo Hotel","rating": 9.1,"stars": 5,"address": "107-6245 Tokyo Prefecture, Minato-ku, Akasaka 9-7-1 Tokyo Midtown, Japan","photo": "https://d2ey9sqrvkqdfs.cloudfront.net/NXnQ/i12_m.jpg","description": "p>Located at the heart of the downtown Roppongi area in Tokyo's tallest building, the 53rd-storey Ritz-Carlton offers elegant luxury high above Tokyo’s busy streets. It features an indoor pool and 8 dining options. Free WiFi is available throughout the hotel.</p>"},
      {"id": 3,"name": "Park Hyatt Tokyo","rating":9.2,"stars":5,"address":"163-1055 Tokyo Prefecture, Shinjuku-ku, Nishishinjuku 3-7-1-2, Japan","photo":"https://d2ey9sqrvkqdfs.cloudfront.net/VuLE/i1_m.jpg","description":"<p>High above Shinjuku’s lively streets, the wide windows of Park Hyatt Tokyo’s spacious rooms offer beautiful views of Mount Fuji or Shinjuku. An indoor pool and 52nd-floor restaurant are featured.</p> <br> <p>Rooms at the Tokyo Park Hyatt boast Hokkaido wood panelling and Egyptian cotton sheets."}
    ];
    const mock_prices : Price[] = [
      {"id": 2,"price": 1234,"competitors": {"Kayak": 1920,"Booking.com": 1363},"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}},
      {"id": 3,"price": 164,"competitors": {"Traveloka": 190,"Expedia": 163},"taxes_and_fees": {"tax": 13.12,"hotel_fees": 16.40}}
    ];
    const mock_hotel_with_price : HotelPrice[] = [
      {
        hotel_detail : mock_hotels[1],
        currency_detail: mock_prices[0],
        order:1,
      },
      {
        hotel_detail : mock_hotels[2],
        currency_detail: mock_prices[1],
        order:1,
      },
      {
        hotel_detail : mock_hotels[0],
        order:0,
      }
    ];
    component.apiHotelData = mock_hotels;
    component.apiPriceData = mock_prices; 
    component.combineHotelAndPrice();
    expect(component.displayData).toEqual(mock_hotel_with_price);
    expect(component.displayData.length).toEqual(3);
  });

  //convertPriceData()
  //has price and competitors and tax
  it('should convert price data with SGD and has competitors and tax',()=>{
    const mock_prices : Price[] = [
      {"id": 3,"price": 123.59,"competitors": {"Kayak": 192.30,"Booking.com": 136.43},"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}},
    ];
    const mock_result_prices : Price[] = [
      {"id": 3,"price": 124,"competitors": [{ name:"Us", price: 124},{name:"Booking.com",price: 136, higher:0.0882},{ name:"Kayak", price: 192, higher:0.354}],"taxes_and_fees": {"tax": 133,"hotel_fees": 145}, "savings":0.354, "most_expensive":192},
    ];
    component.our_name = "Us";
    component.apiPriceData = mock_prices; 
    component.currency = 'SGD';
    component.convertPriceData();
    expect(component.apiPriceData).toEqual(mock_result_prices);
  });

  //convertPriceData()
  //has price and competitors but no tax
  it('should convert price data with USD and has competitors and no tax',()=>{
    const mock_prices : Price[] = [
      {"id": 3,"price": 123.59,"competitors": {"Kayak": 192.30,"Booking.com": 136.43}},
    ];
    const mock_result_prices : Price[] = [
      {"id": 3,"price": 124,"competitors": [{ name:"Us", price: 124},{name:"Booking.com",price: 136, higher:0.0882},{ name:"Kayak", price: 192, higher:0.354}], "savings":0.354, "most_expensive":192},
    ];
    component.our_name = "Us";
    component.apiPriceData = mock_prices; 
    component.currency = 'USD';
    component.convertPriceData();
    expect(component.apiPriceData).toEqual(mock_result_prices);
  });

  //convertPriceData()
  //has price and no competitors
  it('should convert price data with SGD and has tax but no competitors',()=>{
    const mock_prices : Price[] = [
      {"id": 3,"price": 123.59,"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}},
    ];
    const mock_result_prices : Price[] = [
      {"id": 3,"price": 124,"taxes_and_fees": {"tax": 133,"hotel_fees": 145}},
    ];
    component.our_name = "Us";
    component.apiPriceData = mock_prices; 
    component.currency = 'SGD';
    component.convertPriceData();
    expect(component.apiPriceData).toEqual(mock_result_prices);
  });

  //convertPriceData()
  //has price and with competitors
  it('should convert price data with KRW and has competitors and tax',()=>{
    const mock_prices : Price[] = [
      {"id": 3,"price": 123123.59,"competitors": {"Kayak": 192192.30,"Booking.com": 136136.43}},
    ];
    const mock_result_prices : Price[] = [
      {"id": 3,"price": 123100,"competitors": [{ name:"Us", price: 123100},{name:"Booking.com",price: 136100, higher:0.0955},{ name:"Kayak", price: 192200, higher:0.36}],"savings":0.36 ,"most_expensive":192200},
    ];
    component.our_name = "Us";
    component.apiPriceData = mock_prices; 
    component.currency = 'KRW';
    component.convertPriceData();
    expect(component.apiPriceData).toEqual(mock_result_prices);
    expect(component.apiPriceData.length).toEqual(1);
  });

  //convertPriceData()
  //has price and no competitors
  it('should convert price data with KRW and no competitors and tax',()=>{
    const mock_prices : Price[] = [
      {"id": 3,"price": 123123.59},
    ];
    const mock_result_prices : Price[] = [
      {"id": 3,"price": 123100},
    ];
    component.our_name = "Us";
    component.apiPriceData = mock_prices; 
    component.currency = 'KRW';
    component.convertPriceData();
    expect(component.apiPriceData).toEqual(mock_result_prices);
    expect(component.apiPriceData.length).toEqual(1);
  });

  //calculateSavings()
  it('should calculate and return savings for higher competitors',()=>{
    const mock_prices : Price[] = [
      {"id": 3,"price": 123.59,"competitors": [{ name:"Us", price: 123.59},{name:"Booking.com",price: 136.43},{ name:"Kayak", price: 192.30}],"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}},
    ];
    const mock_competitors : CompetitorArray = [
     { name:"Us", price: 123.59},
     { name:"Booking.com",price: 136.43},
     { name:"Kayak", price: 192.30},
    ];
    const mock_result_prices : CompetitorArray = [
      { name:"Us", price: 123.59},
      { name:"Booking.com",price: 136.43, higher:0.0941},
      { name:"Kayak", price: 192.30, higher:0.357}
    ];
    component.our_name = "Us";
    component.apiPriceData = mock_prices;
    component.calculateAllSavings(mock_competitors,0);
    expect(mock_competitors).toEqual(mock_result_prices);
    expect(mock_prices[0].savings).toEqual(0.357);
  });

  //getCurrency() if cookie set to KRW
  it('should get currency KRW value if cookie is set',()=>{
    spyOn(cookie,'check').and.returnValue(true);
    spyOn(cookie,'get').and.returnValue('KRW');
    component.getCurrency();
    expect(component.currency).toBe('KRW');
  });

  //getCurrency() if cookie set to SGD
  it('should get currency SGD value if cookie is set',()=>{
    spyOn(cookie,'check').and.returnValue(true);
    spyOn(cookie,'get').and.returnValue('SGD');
    component.getCurrency();
    expect(component.currency).toBe('SGD');
  });

  //getCurrency() if cookie set to CNY
  it('should get currency CNY value if cookie is set',()=>{
    spyOn(cookie,'check').and.returnValue(true);
    spyOn(cookie,'get').and.returnValue('CNY');
    component.getCurrency();
    expect(component.currency).toBe('CNY');
  });

  //getCurrency() if cookie not set
  it('should get currency KRW value if cookie is set',()=>{
    spyOn(cookie,'check').and.returnValue(false);
    component.getCurrency();
    expect(component.currency).toBe('USD');
  });

  //roundOff price if USD
  it('should round off price to nearest dollar for USD',()=>{
    component.currency = 'USD';
    expect(component.roundOff(235.66)).toBe(236);
  });

  //roundOff price if SGD
  it('should round off price to nearest dollar for SGD',()=>{
    component.currency = 'SGD';
    expect(component.roundOff(450.66)).toBe(451);
  });  
  
  //roundOff price if CNY
  it('should round off price to nearest dollar for CNY',()=>{
    component.currency = 'CNY';
    expect(component.roundOff(523.21)).toBe(523);
  });  
  
  //roundOff price if KRW
  it('should round off price to nearest dollar for KRW',()=>{
    component.currency = 'KRW';
    expect(component.roundOff(235123.66)).toBe(235100);
  });

  //sortPricing() in ascending order
  it('should return sorted competitors',()=>{
    let mock_competitors : CompetitorObject = {"Kayak": 192.30,"Booking.com": 136.43, "Us":123.59};
    let mock_competitors_results : CompetitorArray = [
      { name:"Us", price: 123.59},
      { name:"Booking.com",price: 136.43},
      { name:"Kayak", price: 192.30},
    ];
    let sorted = component.sortPricing(mock_competitors);
    expect(sorted).toEqual(mock_competitors_results);
  });

  //topCompetitorPrice() with sorted competitor array
  it('should return most_expensive pricing from sorted competitors array',()=>{
    const mock_competitors : CompetitorArray = [
      { name:"Us", price: 123.59},
      { name:"Booking.com",price: 136.43},
      { name:"Kayak", price: 192.30},
    ];
    const mock_prices : Price[] = [
      {"id": 3,"price": 123.59,"competitors": [{ name:"Us", price: 123.59},{name:"Booking.com",price: 136.43},{ name:"Kayak", price: 192.30}],"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}},
    ];
    component.apiPriceData = mock_prices;
    component.topCompetitorPrice(mock_competitors,0);
    expect(component.apiPriceData[0].most_expensive).toBe(192.30);
  });

});
