import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'jalali-moment';
import { DatePipe } from "@angular/common";

@Pipe({
  name: 'jalali',
})
export class JalaliPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: any, args?: any): any {
    let date = this.datePipe.transform(value._d,'yyyy-MM-dd') ? value._d : this.datePipe.transform(value,'yyyy-MM-dd');
    let MomentDate = moment(date, 'YYYY/MM/DD');
    return MomentDate.locale('fa').format('YYYY/M/D');
  }
}