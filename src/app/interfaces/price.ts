export interface Price {
    id : number,
    price : number,
    savings ?: number,
    most_expensive ?: number,
    competitors ?: CompetitorArray | CompetitorObject,
    taxes_and_fees ?: {tax: number,hotel_fees:number},
}

export type CompetitorArray = {name: string; price: number; higher ?: number}[];
export type CompetitorObject = {[key : string] : number};
