import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'persianNumber' })
export class PersianNumberPipe implements PipeTransform {
    transform(value: any) {
        var elements: any[];

        if (!value) return value;
        let result: string = '';

        let len = value.toString().length;

        for (let i = 0; i < len; i++) {
            if (value.toString().substr(i, 1) === '1')
                result += '۱';
            else if (value.toString().substr(i, 1) === '2')
                result += '۲';
            else if (value.toString().substr(i, 1) === '3')
                result += '۳';
            else if (value.toString().substr(i, 1) === '4')
                result += '۴';
            else if (value.toString().substr(i, 1) === '5')
                result += '۵';
            else if (value.toString().substr(i, 1) === '6')
                result += '۶';
            else if (value.toString().substr(i, 1) === '7')
                result += '۷';
            else if (value.toString().substr(i, 1) === '8')
                result += '۸';
            else if (value.toString().substr(i, 1) === '9')
                result += '۹';
            else if (value.toString().substr(i, 1) === '0')
                result += '۰';
            else result += value.toString().substr(i, 1);
        }
        return result;
    }
}