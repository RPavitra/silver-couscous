import { Price } from './price';
import { Hotel } from './hotel';

export type HotelPrice  = { hotel_detail: Hotel, currency_detail ?: Price, order: number};
