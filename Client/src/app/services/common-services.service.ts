import { Injectable } from '@angular/core';
import { CartableTypeModel } from '../model/cartable-type.model';
import { RuleTypeModel } from '../model/rule-type.model';
import { OperatorModel } from '../model/operator.model';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {

  constructor() { }



  getCartableTypes(): CartableTypeModel[] {
    return [
      {
        name: 'Marketing',
        persianName: 'بازاریابی',
        id: 1
      }, {
        name: 'Cancelation',
        persianName: 'ابطال',
        id: 2
      }, {
        name: 'Assignment',
        persianName: 'تخصیص',
        id: 3
      }, {
        name: 'ChangeAccount',
        persianName: 'تغییر شماره حساب',
        id: 4
      }, {
        name: 'ChangeAddress',
        persianName: 'تغییر آدرس و کدپستی و صنف',
        id: 5
      }, {
        name: 'ChangeMerchantShaparakValue',
        persianName: 'تغییر اطلاعات شاپرکی پذیرنده',
        id: 6
      }, {
        name: 'ChangeTerminalService',
        persianName: 'تغییر سرویسهای ترمینال',
        id: 7
      }, {
        name: 'ChangeMerchantInternalValue',
        persianName: 'تغییر اطلاعات داخلی پذیرنده',
        id: 8
      },
      {
        name: 'Upload',
        persianName: 'بارگزاری مدارک',
        id: 12
      }
    ];
  }
}
