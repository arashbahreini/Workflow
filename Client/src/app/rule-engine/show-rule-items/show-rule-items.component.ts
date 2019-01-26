import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { RuleGroupModel, RuleItemModel, RuleItemBody, RuleExceptionModel } from '../../model/rule-group.model';
import { CommonServicesService } from '../../services/common-services.service';
import { RuleTypeModel } from '../../model/rule-type.model';
import { OperatorModel } from '../../model/operator.model';
import { ProvinceModel } from '../../model/province.model';
import { BasicInformationService } from '../../services/basic-information.service';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { Message } from 'primeng/components/common/api';
import { RuleEngineService } from '../../services/rule-engine.service';
import { BussinessCategoryModel } from '../../model/Bussiness-category.model';
import { GetBussinessCategorySuplyModel } from '../../model/bussiness-category-suply.model';
import { BrandModel } from '../../model/brand.model';
import { ServiceModel } from '../../model/service.model';
import { BankModel } from '../../model/bank.model';
import { CartableTypeModel } from '../../model/cartable-type.model';
import * as moment from 'jalali-moment';
import { DatePipe } from '@angular/common';
import { JalaliPipe } from '../../pipes/jalali.pipe';
import { ConnectionTypeModel } from '../../model/connection-type.model';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ShowDataDialogComponent } from '../show-data-dialog/show-data-dialog.component';
import { IdTitleModel } from '../../model/id-title.model';
import { PersianNumberPipe } from '../../pipes/persian-number.pipe';
import { AddEditExceptionComponent } from '../add-edit-exception-dialog/add-edit-exception-dialog.component';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-show-rule-items',
  templateUrl: './show-rule-items.component.html',
  styleUrls: ['./show-rule-items.component.css'],
  providers: [
    JalaliPipe,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class ShowRuleItemsComponent implements OnInit {
  @Input() ruleGroup: RuleGroupModel;
  @Output() saveAction = new EventEmitter();
  @ViewChild('element') element: ElementRef;

  public ruleTypes: RuleTypeModel[] = [];
  public miscRuleTypes: RuleTypeModel[] = [];
  public ruleType: RuleTypeModel = new RuleTypeModel();
  public operators: OperatorModel[] = [];
  public Provinces: ProvinceModel[] = [];
  public connectionTypes: ConnectionTypeModel[] = [];
  public posStatuses: IdTitleModel[] = [];
  public banks: BankModel[] = [];
  public BussinessCategories: BussinessCategoryModel[] = [];
  public BussinessCategorySuplies: GetBussinessCategorySuplyModel[] = [];
  public errorMessages: Message[] = [];
  public brands: BrandModel[] = [];
  public services: ServiceModel[] = [];
  public acceptorTypes: IdTitleModel[];
  public marketingTypes: IdTitleModel[];
  public editModel: boolean;
  public showPosCount: boolean;
  public showMarketingTimePassed: boolean;
  public showCitiList: boolean;
  public showProvinceList: boolean;
  public showBussinessCategory: boolean;
  public showBussinessCategorySuplyList: boolean;
  public showBrands: boolean;
  public showAcceptorTypes: boolean;
  public showDeviceModel: boolean;
  public showServiceList: boolean;
  public showBankList: boolean;
  public showConnectionTypes: boolean;
  public showPosStatus: boolean;
  public showBranchList: boolean;
  public showStartDate: boolean;
  public showMarketingTypes: boolean;
  public showMisc: boolean;
  public hasResult: boolean;
  public persianNumberPipe: PersianNumberPipe = new PersianNumberPipe();
  datePickerConfig = {
    drops: 'up',
    format: 'YYYY/MM/DD',
  };

  public cartable: CartableTypeModel = new CartableTypeModel();
  constructor(
    private basicInformationService: BasicInformationService,
    private loadingService: LoadingService,
    private ruleEngineService: RuleEngineService,
    private commonService: CommonServicesService,
    private jalaliPipe: JalaliPipe,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.ruleGroup.Name) {
      this.editModel = true;
      this.loadingService.start();
      this.getServices(true);
    } else {
      this.hasResult = true;
    }
    this.getRuleTypes();
    this.getOperators();
    this.cartable = this.commonService.getCartableTypes().find(x => x.id === this.ruleGroup.CartableType);
  }

  openSelectDialog(data: any, ruleItem: RuleItemModel, selectionName: string) {
    const dialogRef = this.dialog.open(ShowDataDialogComponent, {
      data: data,
      width: '80%',
      maxHeight: '70vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (selectionName === 'BussinessCategory') {
          const ruleIndex = this.ruleGroup.RuleItems.indexOf(ruleItem);
          this.ruleGroup.RuleItems[ruleIndex].BussinessCategory = res;
          this.GetBussinessCategorySuplies(res, ruleItem);
        }
      }
    });
  }
  addStatementToDescription() {
    this.ruleGroup.Description = this.element.nativeElement.textContent;
  }

  openDeleteDialog(ruleException: RuleExceptionModel) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      data: 'آیا از حذف این استثنا اطمینان دارید ؟ ',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.ruleGroup.RuleExceptions.indexOf(ruleException);
        this.ruleGroup.RuleExceptions.splice(index, 1);
      }
    });
  }

  openAddEditException(exception: RuleExceptionModel, action: string) {
    if (action === 'add') {
      exception = new RuleExceptionModel();
    }
    const dialogRef = this.dialog.open(AddEditExceptionComponent, {
      data: { data: exception, action: action },
      width: '50%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res: RuleExceptionModel) => {
      if (res) {
        if (action === 'edit') {
        } else {
          if (!this.ruleGroup.RuleExceptions) {
            this.ruleGroup.RuleExceptions = [];
          }
          this.ruleGroup.RuleExceptions.push(res);
        }
      }
    });
  }

  getRuleTypes() {
    this.ruleTypes = [];
    this.ruleEngineService.getRuleTypes().subscribe(
      (res: any) => {
        this.ruleTypes = res;
      },
      (error: any) => {

      }
    );
  }

  getNotIncludedRightOperandPersianName(ruleItem: RuleItemModel, operand: string) {
    let isLast: boolean;
    if (ruleItem.BodyObj.LeftOperand === 'misc') {
      if (this.ruleTypes.length > 0) {
        isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
        return this.ruleTypes.find(x => x.Name === 'misc')
          .Children.find(x => x.Name.toString() === operand.toString()).PersianName + (isLast ? ' ' : ' و ');
      }
    }
    return this.persianNumberPipe.transform(ruleItem.BodyObj.RightOperand);
  }

  getRightOperandPersianName(ruleItem: RuleItemModel, operand: string) {
    let isLast: boolean;
    if (ruleItem.BodyObj.LeftOperand === 'city') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return ruleItem.Province.Cities.find(x => x.Id === +operand).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'acceptorType') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.acceptorTypes.find(x => x.Id === +operand).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'province') {
      if (this.Provinces.length) {
        isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
        return this.Provinces.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
      }

    }

    if (ruleItem.BodyObj.LeftOperand === 'deviceModel') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return ruleItem.Brand.deviceModel.find(x => x.Id === +operand).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'bussinessCategorySuply') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return ruleItem.BussinessCategory.GetBussinessCategorySuplies.find(x => x.Id.toString() === operand).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'service') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.services.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'bank') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.banks.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'deviceBrand') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.brands.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'connectionType') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.connectionTypes.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'posStatus') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.posStatuses.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'marketingType') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.marketingTypes.find(x => x.Id.toString() === operand.toString()).Title + (isLast ? ' ' : ' و ');
    }

    if (ruleItem.BodyObj.LeftOperand === 'misc') {
      isLast = ruleItem.BodyObj.RightOperand.indexOf(operand) === ruleItem.BodyObj.RightOperand.length - 1;
      return this.miscRuleTypes.find(x => x.Name.toString() === operand.toString()).PersianName + (isLast ? ' ' : ' و ');
    }
  }

  getOperators() {
    this.operators = [];
    this.ruleEngineService.getOperators().subscribe(
      (res: any) => {
        this.operators = res;
      },
      (error: any) => {

      }
    );
  }

  getRuleGroupItems() {
    this.loadingService.start();
    this.ruleEngineService.getRuleGroupItems(this.ruleGroup.Id).subscribe(
      (res: any) => {
        res.StartDate = res.StartDate ? moment(this.jalaliPipe.transform(res.StartDate), 'jYYYY,jMM,jDD') : null;
        res.EndDate = res.EndDate ? moment(this.jalaliPipe.transform(res.EndDate), 'jYYYY,jMM,jDD') : null;
        res.RuleItems.forEach(element => {
          if (element.StartDate) {
            element.StartDate = moment(this.jalaliPipe.transform(element.StartDate), 'jYYYY,jMM,jDD');
          }
          if (element.EndDate) {
            element.EndDate = moment(this.jalaliPipe.transform(element.EndDate), 'jYYYY,jMM,jDD');
          }
        });
        this.ruleGroup = res;
        this.hasResult = true;
        this.ruleGroup.RuleItems.forEach(element => {
          element.BodyObj = JSON.parse(element.Body);
        });
        this.getConnectionTypes(true);
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست قوانین', });
        this.loadingService.stop();
      }
    );
  }

  clearEditForm() {
    this.showCitiList = false;
    this.showProvinceList = false;
    this.showPosCount = false;
    this.showMarketingTimePassed = false;
    this.showBussinessCategory = false;
    this.showBussinessCategorySuplyList = false;
    this.showBrands = false;
    this.showDeviceModel = false;
    this.showServiceList = false;
    this.showBankList = false;
    this.showStartDate = false;
    this.showConnectionTypes = false;
    this.showPosStatus = false;
    this.showAcceptorTypes = false;
    this.showMisc = false;
    this.ruleType = new RuleTypeModel();
  }

  setRuleBody(event: any, ruleItem: RuleItemModel) {
    ruleItem.BodyObj.RightOperand = [];
    ruleItem.BodyObj.Operator = null;
    ruleItem.BodyObj.LeftOperand = this.ruleTypes.find(x => x.PersianName === event.value).Name;
    this.clearEditForm();
    this.ruleType = this.ruleTypes.find(x => x.PersianName === event.value);

    if (this.ruleType.Name === 'deviceModel' || this.ruleType.Name === 'deviceBrand') {
      this.getBrands();
      if (this.ruleType.Name === 'deviceBrand') {
        ruleItem.Brand = new BrandModel();
      }
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'service') {
      this.getServices();
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'bank' || this.ruleType.Name === 'branch') {
      this.getBanks();
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'bussinessCategory' || this.ruleType.Name === 'bussinessCategorySuply') {
      this.getBussinessCategories();
      if (this.ruleType.Name === 'bussinessCategorySuply') {
        ruleItem.BussinessCategory = new BussinessCategoryModel();
      }
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'province' || this.ruleType.Name === 'city') {
      this.getProvinces();
      if (this.ruleType.Name === 'city') {
        ruleItem.Province = new ProvinceModel();
      }
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'connectionType') {
      this.getConnectionTypes();
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'acceptorType') {
      this.getAcceptorTypes();
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'marketingType') {
      this.getMarketingTypes();
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'posStatus') {
      this.getPosStatuses();
      ruleItem.BodyObj.Operator = 'include';
    } else if (this.ruleType.Name === 'misc') {
      this.miscRuleTypes = this.ruleTypes.find(x => x.Name === 'misc').Children;
      ruleItem.BodyObj.Operator = '==';
    }


    this.showBrands = true ? (this.ruleType.Name === 'deviceModel' || this.ruleType.Name === 'deviceBrand') : false;
    this.showMarketingTypes = true ? this.ruleType.Name === 'marketingType' : false;
    this.showMisc = true ? this.ruleType.Name === 'misc' : false;
    this.showAcceptorTypes = true ? this.ruleType.Name === 'acceptorType' : false;
    this.showBankList = true ? (this.ruleType.Name === 'bank' || this.ruleType.Name === 'branch') : false;
    this.showConnectionTypes = true ? (this.ruleType.Name === 'connectionType') : false;
    this.showPosStatus = true ? (this.ruleType.Name === 'posStatus') : false;
    this.showServiceList = true ? this.ruleType.Name === 'service' : false;
    this.showProvinceList = true ? (this.ruleType.Name === 'province' || this.ruleType.Name === 'city') : false;
    this.showBussinessCategory = true ?
      (this.ruleType.Name === 'bussinessCategory' || this.ruleType.Name === 'bussinessCategorySuply') : false;
    this.showPosCount = true ? this.ruleType.Name === 'posCount' : false;
    this.showMarketingTimePassed = true ? this.ruleType.Name === 'marketingTimePassed' : false;
    this.showStartDate = true ? this.ruleType.Name === 'posCount' : false;
    this.ruleGroup.RuleItems.forEach(element => {
      element.RuleType =
        JSON.parse(JSON.stringify(this.ruleTypes.find(x => x.PersianName === element.RuleType.PersianName)));
    });
  }

  disableSaveButton() {
    return this.ruleGroup.RuleItems.find(x => x.addMode);
  }


  getDeviceModels(ruleItem: RuleItemModel) {
    this.showDeviceModel = true;
    ruleItem.BrandId = ruleItem.Brand.Id;
    ruleItem.Brand = this.brands.find(x => x.Id === ruleItem.BrandId);
  }

  getServices(isStartup: boolean = false) {
    this.errorMessages = [];
    this.services = [];
    this.basicInformationService.getServices().subscribe(
      (res: any) => {
        this.services = res;
        if (isStartup) {
          this.getMarketingTypes(true);
        }

      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست سرویس ها', });
      }
    );
  }

  getMarketingTypes(isStartup: boolean = false) {
    this.errorMessages = [];
    this.marketingTypes = [];
    this.basicInformationService.getMarketingTypes().subscribe(
      (res: any) => {
        this.marketingTypes = res;
        if (isStartup) {
          this.getAcceptorTypes(true);
        }
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست انواع بازاریابی', });
      }
    );
  }

  getAcceptorTypes(isStartup: boolean = false) {
    this.errorMessages = [];
    this.acceptorTypes = [];
    this.basicInformationService.getAcceptorTypes().subscribe(
      (res: any) => {
        this.acceptorTypes = res;
        if (isStartup) {
          this.getProvinces(true);
        }

      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست سرویس ها', });
      }
    );
  }

  getProvinces(isStartup: boolean = false) {
    this.errorMessages = [];
    this.Provinces = [];
    this.basicInformationService.getProvinces().subscribe(
      (res: any) => {
        this.Provinces = res;
        if (isStartup) {
          this.getBrands(true);
        }
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست استان ها', });
      }
    );
  }

  getConnectionTypes(isStartup: boolean = false) {
    this.errorMessages = [];
    this.connectionTypes = [];
    this.basicInformationService.getConnectionTypes().subscribe(
      (res: any) => {
        this.connectionTypes = res;
        this.connectionTypes.forEach(element => {
          element.Id = +element.Id;
        });
        if (isStartup) {
          this.getPosStatuses();
        }
      }, (error: any) => {
        this.loadingService.stop();
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست نوع ارتباطات', });
      }
    );
  }

  getPosStatuses(isStartup: boolean = false) {
    this.errorMessages = [];
    this.posStatuses = [];
    this.basicInformationService.getPosStatuses().subscribe(
      (res: any) => {
        this.posStatuses = res;
        this.loadingService.stop();
      }, (error: any) => {
        this.loadingService.stop();
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست نوع ارتباطات', });
      }
    );
  }

  getBanks(isStartup = false) {
    this.errorMessages = [];
    this.banks = [];
    this.basicInformationService.getBanks().subscribe(
      (res: any) => {
        this.banks = res;
        if (isStartup) {
          this.getRuleGroupItems();
        }
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست بانک ها', });
      }
    );
  }

  getRightOperandVisibility(ruleItem: RuleItemModel) {
    if (ruleItem.BodyObj.LeftOperand === 'bank') {
      return false;
    }
    if (ruleItem.BodyObj.LeftOperand === 'service') {
      return false;
    }
    if (ruleItem.BodyObj.LeftOperand === 'province') {
      return false;
    }
    if (ruleItem.BodyObj.LeftOperand === 'deviceBrand') {
      return false;
    }
    return ruleItem.BodyObj.Operator === 'include';
  }

  getBranchs(ruleItem: RuleItemModel) {
    this.errorMessages = [];
    if (ruleItem.RuleType.Name === 'branch') {
      ruleItem.BodyObj.RightOperand = [];
      ruleItem.Bank = this.banks.find(x => x.Id === ruleItem.Bank.Id);
      ruleItem.BankId = ruleItem.Bank.Id;
      this.showBranchList = true;
    }

    this.basicInformationService.getBranch(ruleItem.Bank.Id).subscribe(
      (res: any) => {
        ruleItem.Bank.branches = [];
        ruleItem.Bank.branches = res;
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست بانک ها', });
      }
    );
  }

  getBrands(isStartup = false) {
    this.errorMessages = [];
    this.brands = [];
    this.basicInformationService.getBrands().subscribe(
      (res: any) => {
        this.brands = res;
        if (isStartup) {
          this.getBanks(true);
        }
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن نوع دستگاه ها', });
      }
    );
  }

  getBussinessCategories() {
    this.errorMessages = [];
    this.BussinessCategories = [];
    this.basicInformationService.getBussinessCategories().subscribe(
      (res: any) => {
        this.BussinessCategories = res;
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست اصناف', });
      }
    );
  }

  GetBussinessCategorySuplies(event: BussinessCategoryModel, ruleItem: RuleItemModel = null) {
    this.cleanReferences(ruleItem);
    this.showBussinessCategorySuplyList = true ? ruleItem.RuleType.Name === 'bussinessCategorySuply' : false;
    this.errorMessages = [];
    if (ruleItem) {
      ruleItem.BussinessCategory = this.BussinessCategories.find(x => x.Id === event.Id);
    }
    ruleItem.BodyObj.RightOperand = [];
    ruleItem.BussinessCategoryId = event.Id;
    this.basicInformationService.GetBussinessCategorySupls(event.Id).subscribe(
      (res: any) => {
        ruleItem.BussinessCategory.GetBussinessCategorySuplies = res;
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست زیر مجموعه های صنف', });
      }
    );
  }

  getLeftOperandName(ruleItem: RuleItemModel) {
    if (ruleItem.BodyObj.LeftOperand === 'bussinessCategorySuply') {
      return 'صنف';
    }

    if (ruleItem.BodyObj.LeftOperand === 'city' || ruleItem.BodyObj.LeftOperand === 'province') {
      return 'استان';
    }

    if (ruleItem.BodyObj.LeftOperand === 'deviceModel') {
      return 'مدل دستگاه';
    }

    if (ruleItem.BodyObj.LeftOperand === 'bank' || ruleItem.BodyObj.LeftOperand === 'branch') {
      return 'بانک';
    }
  }

  getCities(event: any, ruleItem: RuleItemModel = null) {
    this.showCitiList = true ? ruleItem.BodyObj.LeftOperand === 'city' : false;
    if (ruleItem) {
      ruleItem.Province = this.Provinces.find(x => x.Id === event.value);
    }
    ruleItem.BodyObj.RightOperand = [];
    this.errorMessages = [];
    this.basicInformationService.getCities(event.value).subscribe(
      (res: any) => {
        ruleItem.Province.Cities = res;
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست شهر ها', });
      }
    );
  }

  removeRuleItem(RuleItem: RuleItemModel) {
    this.ruleGroup.RuleItems.splice(this.ruleGroup.RuleItems.indexOf(RuleItem), 1);
  }

  cleanReferences(ruleItem: RuleItemModel) {
    ruleItem.BrandId = 0;
    ruleItem.BussinessCategoryId = 0;
    ruleItem.BankId = 0;
    ruleItem.ProvinceId = 0;
  }

  getOperatorPersianName(RuleItem: RuleItemModel, RightOperand: any) {
    if (RuleItem.BodyObj.LeftOperand === 'city') {
      if (RuleItem.Province) {
        return RuleItem.Province.Cities.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'acceptorType') {
      if (this.acceptorTypes.length > 0) {
        return this.acceptorTypes.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'province') {
      if (this.Provinces.length > 0) {
        return this.Provinces.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'connectionType') {
      if (this.connectionTypes.length > 0) {
        return this.connectionTypes.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'posStatus') {
      if (this.posStatuses.length > 0) {
        return this.posStatuses.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'marketingType') {
      if (this.marketingTypes.length > 0) {
        return this.marketingTypes.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'bussinessCategorySuply') {
      if (RuleItem.BussinessCategory) {
        return RuleItem.BussinessCategory.GetBussinessCategorySuplies.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'deviceModel') {
      if (RuleItem.Brand) {
        return RuleItem.Brand.deviceModel.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'deviceBrand') {
      if (this.brands.length > 0) {
        return this.brands.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'service') {
      if (this.services.length) {
        return this.services.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'bank') {
      if (this.banks.length) {
        return this.banks.find(x => x.Id === RightOperand).Title;
      }
    }

    if (RuleItem.BodyObj.LeftOperand === 'branch') {
      if (RuleItem.Bank) {
        return RuleItem.Bank.branches.find(x => x.Id === RightOperand).Title;
      }
    }


  }

  getMainOperatorName(RuleItem: RuleItemModel) {
    if (RuleItem.BodyObj.LeftOperand === 'city' || RuleItem.BodyObj.LeftOperand === 'province') {
      if (RuleItem.Province) {
        return RuleItem.Province.Title;
      }
    }
    if (RuleItem.BodyObj.LeftOperand === 'bussinessCategorySuply') {
      if (RuleItem.BussinessCategory) {
        return RuleItem.BussinessCategory.Title;
      }
    }
    if (RuleItem.BodyObj.LeftOperand === 'deviceModel') {
      if (RuleItem.Brand) {
        return RuleItem.Brand.Title;
      }
    }
  }

  async selectAll(ruleItem: RuleItemModel) {
    this.showCitiList = false;
    ruleItem.BodyObj.RightOperand = [];
    if (ruleItem.RuleType.Name === 'city') {
      ruleItem.Province.Cities.forEach(element => {
        ruleItem.BodyObj.RightOperand.push(element.Id);
      });
      await this.delay();
      this.showCitiList = true;
    } else if (ruleItem.RuleType.Name === 'branch') {
      ruleItem.Bank.branches.forEach(element => {
        ruleItem.BodyObj.RightOperand.push(+element.Id);
      });
      this.showBranchList = false;
      await this.delay();
      this.showBranchList = true;
    }
  }

  delay() { return new Promise(resolve => setTimeout(resolve, 10)); }

  saveRuleItem(RuleItem: RuleItemModel) {
    const ruleItem = this.ruleGroup.RuleItems[this.ruleGroup.RuleItems.indexOf(RuleItem)];
    ruleItem.BodyObj.LeftOperand = RuleItem.RuleType.Name;
    if (RuleItem.RuleType.Type === 'string') {
      ruleItem.BodyObj.Operator = 'include';
    }

    if (RuleItem.RuleType.Name === 'city') {
      ruleItem.ProvinceId = ruleItem.Province.Id;
    }
    ruleItem.Operator = this.operators.find(x => x.Operator === ruleItem.BodyObj.Operator);
    ruleItem.addMode = false;
    console.log(this.ruleGroup);
  }

  disableSaveRuleItem(RuleItem) {
    if (RuleItem.RuleType.Name &&
      RuleItem.BodyObj.Operator &&
      (RuleItem.BodyObj.RightOperand.length > 0 && RuleItem.BodyObj.RightOperand[0])) {

      if (RuleItem.RuleType.Name === 'posCount' && RuleItem.StartDate) {
        if (RuleItem.StartDate) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  editRuleItem(RuleItem: RuleItemModel) {
    const leftOperand = RuleItem.BodyObj.LeftOperand;
    if (leftOperand === 'deviceModel' || leftOperand === 'deviceBrand') {
      this.getBrands();
      this.showBrands = true;
      if (leftOperand === 'deviceModel') {
        this.showDeviceModel = true;
      }
    } else {
      this.showBrands = false;
      this.showDeviceModel = false;
    }

    if (leftOperand === 'bank' || leftOperand === 'branch') {
      this.getBanks();
      this.showBankList = true;
    } else {
      this.showBankList = false;
    }

    if (leftOperand === 'connectionType') {
      this.getConnectionTypes();
      this.showConnectionTypes = true;
    } else {
      this.showConnectionTypes = false;
    }

    if (leftOperand === 'posStatus') {
      this.getPosStatuses();
      this.showPosStatus = true;
    } else {
      this.showPosStatus = false;
    }

    if (leftOperand === 'marketingType') {
      this.getMarketingTypes();
      this.showMarketingTypes = true;
    } else {
      this.showMarketingTypes = false;
    }

    if (leftOperand === 'service') {
      this.getServices();
      this.showServiceList = true;
    } else {
      this.showServiceList = false;
    }

    if (leftOperand === 'city') {
      this.getProvinces();
      this.showCitiList = true;
      this.showProvinceList = true;
    } else {
      this.showProvinceList = false;
      this.showCitiList = false;
    }

    if (leftOperand === 'acceptorType') {
      this.getAcceptorTypes();
      this.showAcceptorTypes = true;
    } else {
      this.showAcceptorTypes = false;
    }

    if (leftOperand === 'province') {
      this.getProvinces();
      this.showProvinceList = true;
    }

    if (leftOperand === 'bussinessCategorySuply') {
      this.getBussinessCategories();
      this.showBussinessCategorySuplyList = true;
      this.showBussinessCategory = true;
    } else {
      this.showBussinessCategory = false;
      this.showBussinessCategorySuplyList = false;
    }

    if (leftOperand === 'posCount') {
      this.showStartDate = true;
      this.showPosCount = true;
    } else {
      this.showPosCount = false;
      this.showStartDate = false;
    }

    if (leftOperand === 'marketingTimePassed') {
      this.showMarketingTimePassed = true;
    } else {
      this.showMarketingTimePassed = false;
    }

    if (leftOperand === 'misc') {
      this.miscRuleTypes = this.ruleTypes.find(x => x.Name === 'misc').Children;
      this.showMisc = true;
    } else {
      this.showMisc = false;
    }

    this.ruleGroup.RuleItems.forEach(element => {
      element.addMode = false;
    });
    this.ruleGroup.RuleItems[this.ruleGroup.RuleItems.indexOf(RuleItem)].addMode = true;
    console.log(this.ruleGroup.RuleItems);
  }

  showSelectedValue(ruleItem: RuleItemModel) {
    if (ruleItem.BodyObj.LeftOperand === 'misc') {
      if (this.ruleTypes.length > 0) {
        return this.ruleTypes.find(x => x.Name === 'misc')
          .Children.find(x => x.Name === ruleItem.BodyObj.RightOperand[0])
          .PersianName;
      }
      return '';
    }
    return ruleItem.BodyObj.RightOperand;
  }

  addRuleItem() {
    const ruleItem = new RuleItemModel();
    ruleItem.RuleType = new RuleTypeModel();
    ruleItem.addMode = true;
    ruleItem.BodyObj.RightOperand = [];
    this.ruleGroup.RuleItems.push(ruleItem);
    this.clearEditForm();
    console.log(this.ruleGroup.RuleItems);

  }

  disableAddButton() {
    if (this.ruleGroup.RuleItems.find(x => x.addMode)) {
      return true;
    }
    return false;
  }

  saveRuleGroup() {
    this.errorMessages = [];
    if (!this.ruleGroup.Name) {
      this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'فیلد نام خالیست', });
      return;
    }
    this.addStatementToDescription();
    this.loadingService.start();
    this.ruleGroup.RuleItems.forEach(element => {
      element.Body = JSON.stringify(element.BodyObj);
    });
    this.ruleEngineService.addRuleGroup(this.ruleGroup).subscribe(
      (res: any) => {
        this.loadingService.stop();
        this.saveAction.emit('success');
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در ذخیره ی گروه', });
        this.loadingService.stop();
      }
    );
  }
}
