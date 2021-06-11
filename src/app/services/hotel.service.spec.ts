import { Price } from './../interfaces/price';
import { Hotel } from './../interfaces/hotel';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HotelService } from './hotel.service';
import { of } from 'rxjs/internal/observable/of';

describe('HotelService', () => {

  let service: HotelService;
  let httpMock: HttpTestingController;
  const mock_hotels : Hotel[] = [
    {"id": 1,"name": "Shinagawa Prince Hotel","rating": 7.7,"stars": 4,"address": "108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan","photo": "https://d2ey9sqrvkqdfs.cloudfront.net/ZqSQ/i1_t.jpg","description": "<p>Boasting 15 food and beverage options, 2 swimming pools, and its own aquarium, Prince Hotel is right next to JR Shinagawa Train Station, from where Haneda Airport is only a 25-minute train ride away. This 39-storey hotel offers beautiful Tokyo views and free WiFi throughout the entire hotel.</p>"},
    {"id": 2,"name": "Ritz Carlton Tokyo Hotel","rating": 9.1,"stars": 5,"address": "107-6245 Tokyo Prefecture, Minato-ku, Akasaka 9-7-1 Tokyo Midtown, Japan","photo": "https://d2ey9sqrvkqdfs.cloudfront.net/NXnQ/i12_m.jpg","description": "p>Located at the heart of the downtown Roppongi area in Tokyo's tallest building, the 53rd-storey Ritz-Carlton offers elegant luxury high above Tokyo’s busy streets. It features an indoor pool and 8 dining options. Free WiFi is available throughout the hotel.</p>"}
  ];
  const mock_prices : Price[] = [
    {"id": 1,"price": 164,"competitors": {"Traveloka": 190,"Expedia": 163},"taxes_and_fees": {"tax": 13.12,"hotel_fees": 16.40}},
    {"id": 2,"price": 1234,"competitors": {"Kayak": 1920,"Booking.com": 1363},"taxes_and_fees": {"tax": 133.12,"hotel_fees": 145.40}}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
    });

    service = TestBed.inject(HotelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpMock.verify();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should get hotel listings from the API via GET',()=>{
    service.getHotels().subscribe((hotels)=>{
      expect(hotels.length).toBe(2);
      expect(hotels).toEqual(mock_hotels);
    });
    
    const request = httpMock.expectOne("https://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo");
    expect(request.request.method).toBe('GET');
    request.flush(mock_hotels);
  });
  
  it('should get price listings for USD from the API via GET',()=>{
    service.getPricings('USD').subscribe((prices)=>{
      expect(prices.length).toBe(2);
      expect(prices).toEqual(mock_prices);
    });

    const request = httpMock.expectOne("http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/USD");
    expect(request.request.method).toBe('GET');
    request.flush(mock_prices);
  });

  it('should get price listings for SGD from the API via GET',()=>{
    service.getPricings('SGD').subscribe((prices)=>{
      expect(prices.length).toBe(2);
      expect(prices).toEqual(mock_prices);
    });

    const request = httpMock.expectOne("http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/SGD");
    expect(request.request.method).toBe('GET');
    request.flush(mock_prices);
  });

  it('should get price listings for CNY from the API via GET',()=>{
    service.getPricings('CNY').subscribe((prices)=>{
      expect(prices.length).toBe(2);
      expect(prices).toEqual(mock_prices);
    });

    const request = httpMock.expectOne("http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/CNY");
    expect(request.request.method).toBe('GET');
    request.flush(mock_prices);
  });

  it('should get price listings for KRW from the API via GET',()=>{
    service.getPricings('KRW').subscribe((prices)=>{
      expect(prices.length).toBe(2);
      expect(prices).toEqual(mock_prices);
    });

    const request = httpMock.expectOne("http://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels/tokyo/1/KRW");
    expect(request.request.method).toBe('GET');
    request.flush(mock_prices);
  });

  it('should get hotel and price listings from the API via GET',()=>{
    spyOn(service,'getHotels').and.returnValue(of(mock_hotels));
    spyOn(service,'getPricings').and.returnValue(of(mock_prices));

    service.getHotelWithPricing('USD').subscribe((data)=>{
      expect(data.length).toBe(2);
      expect(data).toEqual([mock_hotels,mock_prices]);
    });
  });

});
