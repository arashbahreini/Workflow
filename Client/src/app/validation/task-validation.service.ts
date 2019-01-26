import { Injectable } from '@angular/core';
import { ResultModel } from '../model/result-model';
import { TaskModel } from '../model/task.model';

@Injectable()
export class TaskValidationService {

  public result: ResultModel = new ResultModel();

  public addTaskValidation(task: TaskModel): ResultModel {
    this.result = new ResultModel();
    if (!task.Name) {
      this.result.success = false;
      this.result.messages.push('نام خالیست');
    }

    if (task.Settings) {
      if (task.Settings.find(x => x.Name === 'زمان لازم' && (x.Value === '' || x.Value === null))) {
        this.result.success = false;
        this.result.messages.push('برای این این تسک هیچ زمانی انتخاب نشده است');
      }
    }

    return this.result;
  }

  public editTaskValidation(task: TaskModel): ResultModel {
    this.result = new ResultModel();

    if (task.Settings) {
      if (task.Settings.find(x => x.Name === 'زمان لازم' && (x.Value === '' || x.Value === null))) {
        this.result.success = false;
        this.result.messages.push('برای این این تسک هیچ زمانی انتخاب نشده است');
      }
    }

    let selectedEmploys = [];
    let selectedRoles = [];
    if (task.Settings) {
      if (task.Settings.length > 0) {
        if (task.Settings.find(x => x.Name === 'کاربر')) {
          selectedEmploys = task.Settings.find(x => x.Name === 'کاربر').Value;
        }
        if (task.Settings.find(x => x.Name === 'گروه کاربری')) {
          selectedRoles = task.Settings.find(x => x.Name === 'گروه کاربری').Value;
        }
      }
    }

    if (!task.Name) {
      this.result.success = false;
      this.result.messages.push('نام خالیست');
    }
    if (task.Settings) {
      if ((task.Settings.find(x => x.Name === 'کاربر') || task.Settings.find(x => x.Name === 'گروه کاربری')) &&
        selectedEmploys.length === 0 &&
        selectedRoles.length === 0) {
        if (task.Settings.find(x => x.Name === 'getUserFromModel')) {
          if (task.Settings.find(x => x.Name === 'getUserFromModel').Value.toString() === 'false' ||
            task.Settings.find(x => x.Name === 'getUserFromModel').Value.toString() === 'False') {
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
