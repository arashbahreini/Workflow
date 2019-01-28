import { Injectable } from '@angular/core';
import { ResultModel } from '../model/result-model';
import { TaskModel } from '../model/task.model';

@Injectable()
export class TaskValidationService {

  public result: ResultModel = new ResultModel();

  public addTaskValidation(task: TaskModel): ResultModel {
    this.result = new ResultModel();
    if (!task.name) {
      this.result.success = false;
      this.result.messages.push('نام خالیست');
    }

    if (task.settings) {
      if (task.settings.find(x => x.name === 'زمان لازم' && (x.value === '' || x.value === null))) {
        this.result.success = false;
        this.result.messages.push('برای این این تسک هیچ زمانی انتخاب نشده است');
      }
    }

    return this.result;
  }

  public editTaskValidation(task: TaskModel): ResultModel {
    this.result = new ResultModel();

    if (task.settings) {
      if (task.settings.find(x => x.name === 'زمان لازم' && (x.value === '' || x.value === null))) {
        this.result.success = false;
        this.result.messages.push('برای این این تسک هیچ زمانی انتخاب نشده است');
      }
    }

    let selectedEmploys = [];
    let selectedRoles = [];
    if (task.settings) {
      if (task.settings.length > 0) {
        if (task.settings.find(x => x.name === 'کاربر')) {
          selectedEmploys = task.settings.find(x => x.name === 'کاربر').value;
        }
        if (task.settings.find(x => x.name === 'گروه کاربری')) {
          selectedRoles = task.settings.find(x => x.name === 'گروه کاربری').value;
        }
      }
    }

    if (!task.name) {
      this.result.success = false;
      this.result.messages.push('نام خالیست');
    }
    if (task.settings) {
      if ((task.settings.find(x => x.name === 'کاربر') || task.settings.find(x => x.name === 'گروه کاربری')) &&
        selectedEmploys.length === 0 &&
        selectedRoles.length === 0) {
        if (task.settings.find(x => x.name === 'getUserFromModel')) {
          if (task.settings.find(x => x.name === 'getUserFromModel').value.toString() === 'false' ||
            task.settings.find(x => x.name === 'getUserFromModel').value.toString() === 'False') {
            this.result.success = false;
            this.result.messages.push('برای این کار باید حد اقل یک گروه کاربری یا یک کاربر انتخاب کنید');
          }
        } else {
          this.result.success = false;
          this.result.messages.push('برای این کار باید حد اقل یک گروه کاربری یا یک کاربر انتخاب کنید');
        }
      }
    }

    return this.result;
  }

}
