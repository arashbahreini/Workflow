import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RuleGroupModel } from '../model/rule-group.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RuleEngineTestRequestModel } from '../model/rule-engine-test-request.model';

@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {
  public url = '/RuleEngine/';
  constructor(private http: HttpClient) { }

  addRuleGroup(roleGroupModel: RuleGroupModel) {
    return this.http.post(this.url + 'AddRuleGroup', roleGroupModel).pipe(
      catchError(this.handleError),
    );
  }

  submitTest(request: RuleEngineTestRequestModel) {
    return this.http.post(this.url + 'TestRuleEngine', request).pipe(
      catchError(this.handleError),
    );
  }

  triggleActiveField(id: number) {
    return this.http.post(this.url + 'TriggleActiveField', { Id: id }).pipe(
      catchError(this.handleError),
    );
  }

  getRuleGroups(cartableType: number) {
    return this.http.post<RuleGroupModel[]>(this.url + 'GetRuleGroups', { CartableType: cartableType }).pipe(
      catchError(this.handleError),
    );
  }

  getRuleGroup(id: number, cartableType: number) {
    return this.http.post(this.url + 'GetRuleGroup', { Id: id, CartableType: cartableType }).pipe(
      catchError(this.handleError),
    );
  }

  deleteRuleGroup(id: number) {
    return this.http.post(this.url + 'DeleteRuleGroup', { Id: id }).pipe(
      catchError(this.handleError),
    );
  }

  getRuleGroupItems(id: number) {
    return this.http.post(this.url + 'GetRuleGroupItems', { Id: id }).pipe(
      catchError(this.handleError),
    );
  }

  modifyRuleGroups(roleGroupModel: RuleGroupModel) {
    return this.http.post(this.url + 'ModifyRuleGroups', roleGroupModel).pipe(
      catchError(this.handleError),
    );
  }

  getOperators() {
    return this.http.get(this.url + 'GetOperators').pipe(
      catchError(this.handleError),
    );
  }

  getRuleTypes() {
    return this.http.get(this.url + 'GetRuleTypes').pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 200)
      return throwError(error.status + '  ' + error.statusText);
  }
}
