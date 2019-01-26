import { Injectable } from '@angular/core';
import { EmployModel } from '../model/employ.model';
import { RoleModel } from '../model/role.model';
import { SelectItem } from 'primeng/api';

@Injectable()
export class EmployeLogicService {

  constructor() { }

  getEmploysFullName(employ: EmployModel): string {
    let result = '';
    if (employ) {
      if (employ.FirstName) {
        result += employ.FirstName;
      }
      if (employ.LastName) {
        result += employ.LastName;
      }
    }
    return result;
  }

  getEmployFullName(employs: SelectItem[], employId: string) {
    return employs.find(x => x.value === employId).value;
  }

  getRoleName(roles: RoleModel[], roleId: string) {
    return roles.find(x => x.ID === roleId).Title;
  }
}
