import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'getHourMinute' })
export class GetHourMinute implements PipeTransform {
    transform(value: number) {
        let result: string;

        if (value < 0) {
            if (value * -1 < 60) {
                result = '-' + 0 + ':' + value * -1;
            } else {
                result = Math.floor((value * -1 / 60) | 0) * -1 + ':' + (value * -1) % 60;
            }
        } else {
            result = Math.floor((value / 60) | 0) + ':' + value % 60;
        }
        return result;
    }
}