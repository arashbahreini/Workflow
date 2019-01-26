import { Component, OnInit } from '@angular/core';
import { CartableTypeModel } from '../../model/cartable-type.model';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonServicesService } from '../../services/common-services.service';
import { ProvinceModel } from '../../model/province.model';
import { BasicInformationService } from '../../services/basic-information.service';
import { RuleEngineTestRequestModel } from '../../model/rule-engine-test-request.model';
import { CityModel } from '../../model/city.model';
import { BussinessCategoryModel } from '../../model/Bussiness-category.model';
import { GetBussinessCategorySuplyModel } from '../../model/bussiness-category-suply.model';
import { DeviceModelModel } from '../../model/device-model.model';
import { BrandModel } from '../../model/brand.model';
import { ServiceModel } from '../../model/service.model';
import { BankModel } from '../../model/bank.model';
import { RuleEngineService } from '../../services/rule-engine.service';

@Component({
  selector: 'app-rule-engine-test',
  templateUrl: './rule-engine-test.component.html',
  styleUrls: ['./rule-engine-test.component.css']
})
export class RuleEngineTestComponent implements OnInit {

  public cartableType: CartableTypeModel = new CartableTypeModel();
  public provinces: ProvinceModel[] = [];
  public cities: CityModel[] = [];
  public testRequest: RuleEngineTestRequestModel = new RuleEngineTestRequestModel();
  public bussinessCategories: BussinessCategoryModel[] = [];
  public bussinessCategorySuplies: GetBussinessCategorySuplyModel[] = []
  public deviceBrands: BrandModel[] = [];
  public deviceBrand: BrandModel = new BrandModel();
  public services: ServiceModel[] = [];
  public banks: BankModel[] = [];
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonServicesService,
    public baseService: BasicInformationService,
    public ruleEngineService: RuleEngineService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.cartableType = this.commonService.getCartableTypes().find(x => x.id === +params['id']);
    });
    this.getProvinces();
    this.getBussinessCategories();
    this.getDeviceBrands();
    this.getServices();
    this.getBanks();
  }

  getBanks() {
    this.banks = [];
    this.baseService.getBanks().subscribe(
      (res: any) => {
        this.banks = res;
      }, (error: any) => {

      }
    )
  }

  submitTest() {
    this.testRequest.CartableType = this.cartableType.id;
    this.testRequest.IsTest = true;
    this.ruleEngineService.submitTest(this.testRequest).subscribe(
      (res:any) => {

      }, (error) => {

      }
    )
  }

  getServices() {
    this.services = [];
    this.baseService.getServices().subscribe(
      (res: any) => {
        this.services = res;
      }, (error: any) => {

      }
    )
  }

  getDeviceBrands() {
    this.deviceBrands = [];
    this.baseService.getBrands().subscribe(
      (res: any) => {
        this.deviceBrands = res;
      }, (error: any) => {

      }
    )
  }

  getProvinces() {
    this.provinces = [];
    this.baseService.getProvinces().subscribe(
      (res: any) => {
        this.provinces = res;
      }, (error: any) => {

      }
    )
  }

  getCities(event: any) {
    this.cities = [];
    this.baseService.getCities(event.value).subscribe(
      (res: any) => {
        this.cities = res;
      }, (error: any) => { }
    )
  }

  getBussinessCategories() {
    this.bussinessCategories = [];
    this.baseService.getBussinessCategories().subscribe(
      (res: any) => {
        this.bussinessCategories = res;
      }, (error: any) => {

      }
    )
  }

  getBussinessCategorySuplies(event: any) {
    this.bussinessCategorySuplies = [];
    this.baseService.GetBussinessCategorySupls(event.value).subscribe(
      (res: any) => {
        this.bussinessCategorySuplies = res;
      }, (error: any) => {

      }
    )
  }
}
