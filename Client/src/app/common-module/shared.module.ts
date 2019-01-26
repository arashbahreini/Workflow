import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersianNumberPipe } from '../pipes/persian-number.pipe';
import { GetHourMinute } from '../pipes/get-hour-minute.pipe';
import { JalaliPipe } from '../pipes/jalali.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PersianNumberPipe, GetHourMinute, JalaliPipe],
  exports: [PersianNumberPipe, GetHourMinute, JalaliPipe]
})
export class SharedModule { }
