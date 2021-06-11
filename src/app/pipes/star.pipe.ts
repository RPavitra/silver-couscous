import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'star'
})
export class StarPipe implements PipeTransform {

  transform(value: Number,index:number) {
    if(index <= value){
      return "star";
    }else{
      return "star_border";
    }
  }

}
