import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ProvinceModel } from '../model/province.model';
import { CityModel } from '../model/city.model';
import { BussinessCategoryModel } from '../model/Bussiness-category.model';
import { BrandModel } from '../model/brand.model';
import { ServiceModel } from '../model/service.model';
import { IdTitleModel } from '../model/id-title.model';
import { ServiceUrlModel } from '../model/service-url.model';

@Injectable()
export class BasicInformationService {
  public url = '/Base/';
  constructor(private http: HttpClient) { }

  getCities(provinceId: number): Observable<CityModel[]> {
    return this.http.post<CityModel[]>(this.url + 'GetCity', { provinceId: provinceId }).pipe(
      catchError(this.handleError),
    );
  }

  getProvinces(): Observable<ProvinceModel[]> {
    return this.http.post<ProvinceModel[]>(this.url + 'GetProvince', null).pipe(
      catchError(this.handleError),
    );
  }

  getConnectionTypes(): Observable<ProvinceModel[]> {
    return this.http.post<ProvinceModel[]>(this.url + 'GetTerminalModel', null).pipe(
      catchError(this.handleError),
    );
  }

  getPosStatuses(): Observable<IdTitleModel[]> {
    return this.http.post<ProvinceModel[]>(this.url + 'GetSerialStatuses', null).pipe(
      catchError(this.handleError),
    );
  }

  getBanks(): Observable<ProvinceModel[]> {
    return this.http.post<ProvinceModel[]>(this.url + 'GetBank', null).pipe(
      catchError(this.handleError),
    );
  }

  getBranch(bankId: number): Observable<ProvinceModel[]> {
    return this.http.post<ProvinceModel[]>(this.url + 'GetBranch', { bankId: bankId }).pipe(
      catchError(this.handleError),
    );
  }

  getServices(): Observable<ServiceModel[]> {
    return this.http.post<ServiceModel[]>(this.url + 'GetServices', null).pipe(
      catchError(this.handleError),
    );
  }

  getMarketingTypes(): Observable<IdTitleModel[]> {
    return this.http.post<ServiceModel[]>(this.url + 'GetMarketingTypes', null).pipe(
      catchError(this.handleError),
    );
  }

  getAcceptorTypes(): Observable<IdTitleModel[]> {
    return this.http.post<ServiceModel[]>(this.url + 'GetAcceptorTypes', null).pipe(
      catchError(this.handleError),
    );
  }

  getBrands(): Observable<BrandModel[]> {
    return this.http.post<BrandModel[]>(this.url + 'GetTerminalBrand', null).pipe(
      catchError(this.handleError),
    );
  }

  getBussinessCategories(): Observable<BussinessCategoryModel[]> {
    return this.http.post<BussinessCategoryModel[]>(this.url + 'GetActivity', null).pipe(
      catchError(this.handleError),
    );
  }

  GetBussinessCategorySupls(activityId: number): Observable<BussinessCategoryModel[]> {
    return this.http.post<BussinessCategoryModel[]>(this.url + 'GetAddedActivity', { activityId: activityId }).pipe(
      catchError(this.handleError),
    );
  }

  checkAuthentication(): Observable<boolean> {
    return this.http.post<boolean>('/Workflow/' + 'CheckAuthentication', null).pipe(
      catchError(this.handleError),
    );
  }

  getServiceParameters(model: ServiceUrlModel) {
    return this.http.get<any>(model.swaggerUrl);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 200) {
      return throwError(error.status + '  ' + error.statusText);
    }
  }
}
