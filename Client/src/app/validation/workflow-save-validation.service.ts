import { Injectable } from '@angular/core';
import { WorkFlowModel } from '../model/workflow.model';
import { ResultModel } from '../model/result-model';
import { NodeDataArrayModel } from '../model/graph.model';

@Injectable()
export class WorkflowSaveValidationService {

  constructor() { }

  validateWorkflowForSave(workFlow: WorkFlowModel): ResultModel {
    const result: ResultModel = new ResultModel();

    const isUsersMatch = { value: [], success: true };
    workFlow.Graph.nodeDataArray.filter(x => x.isIf).forEach(element => {
      if (workFlow.Graph.linkDataArray.find(x => x.to === element.key)) {
        const condition = workFlow.Tasks.find(x => x.Id === element.taskId);
        const from = workFlow.Graph.linkDataArray.find(x => x.to === element.key).from;
        const taskId = workFlow.Graph.nodeDataArray.find(x => x.key === from).taskId;
        const parent = workFlow.Tasks.find(x => x.Id === taskId);

        if (parent.Name === 'Forward' || parent.Name === 'AddRequestToCartable') {
          if (parent.Settings.find(x => x.Name === 'کاربر') && condition.Settings.find(x => x.Name === 'کاربر')) {
            if (parent.Settings.find(x => x.Name === 'کاربر').Value === '') {
              parent.Settings.find(x => x.Name === 'کاربر').Value = '[]';
            }
            const parentUsers = parent.Settings.find(x => x.Name === 'کاربر').Value;
            if (condition.Settings.find(x => x.Name === 'کاربر').Value === '') {
              condition.Settings.find(x => x.Name === 'کاربر').Value = '[]';
            }
            const conditionUsers = condition.Settings.find(x => x.Name === 'کاربر').Value;
            if (JSON.stringify(parentUsers) !== JSON.stringify(conditionUsers)) {
              isUsersMatch.success = false;
              isUsersMatch.value.push(parent);
              isUsersMatch.value.push(condition);
            }
          }

          if (parent.Settings.find(x => x.Name === 'گروه کاربری') && condition.Settings.find(x => x.Name === 'گروه کاربری')) {
            if (parent.Settings.find(x => x.Name === 'گروه کاربری').Value === '') {
              parent.Settings.find(x => x.Name === 'گروه کاربری').Value = '[]';
            }
            const parentRoles = parent.Settings.find(x => x.Name === 'گروه کاربری').Value;
            if (condition.Settings.find(x => x.Name === 'گروه کاربری').Value === '') {
              condition.Settings.find(x => x.Name === 'گروه کاربری').Value = '[]';
            }
            const conditionRoles = condition.Settings.find(x => x.Name === 'گروه کاربری').Value;
            if (JSON.stringify(parentRoles) !== JSON.stringify(conditionRoles)) {
              isUsersMatch.success = false;
              isUsersMatch.value.push(parent);
              isUsersMatch.value.push(condition);
            }
          }
        }
      }
    });

    if (!isUsersMatch.success) {
      result.success = false;
      result.messages.push(
        'کاربران و گروه های کاربری تعریف شده در هر تسک ارجاع دهنده باید با تسک پیگیری کننده ی بعد از آن یکسان باشند' +
        ' در تسک های ' +
        workFlow.Graph.nodeDataArray.find(x => x.taskId === isUsersMatch.value[0].Id).key +
        ' و ' +
        workFlow.Graph.nodeDataArray.find(x => x.taskId === isUsersMatch.value[1].Id).key);
    }

    if (!workFlow.DeadLine) {
      result.success = false;
      result.messages.push('برای فرایند هیچ زمانی انتخاب نشده است');
    }

    if (!workFlow.Name) {
      result.success = false;
      result.messages.push('فیلد نام خالیست');
    }
    if (workFlow.LaunchType === null || workFlow.LaunchType === undefined) {
      result.messages.push('فیلد نوع اجرا خالیست');
      result.success = false;
    }

    if (
      workFlow.LaunchType === 2 &&
      (workFlow.Period === null ||
        workFlow.Period === undefined ||
        workFlow.Period === '00.00:00:00')) {
      result.messages.push('فیلد بازه خالیست');
      result.success = false;
    }

    if (workFlow.Graph) {
      if (workFlow.Graph.nodeDataArray.length > 0) {
        const conditions = [];
        workFlow.Graph.nodeDataArray.forEach(element => {
          if (element.isIf) {
            conditions.push(element);
          }
        });

        conditions.forEach(element => {
          if (workFlow.Graph.linkDataArray.filter(x => x.from === element.key).length < 2) {
            result.messages.push('هر شرط در گراف باید دارای دو فرزند داشته باشد');
            result.success = false;
          }
        });
      }
    }

    let totalTime = 0;
    workFlow.Tasks.forEach(element => {
      if (element.Settings.find(x => x.Name === 'زمان لازم')) {
        totalTime += +element.Settings.find(x => x.Name === 'زمان لازم').Value;
      }
    });

    if (workFlow.DeadLine < totalTime) {
      result.messages
        .push('زمان لازم برای اجرای فرایند باید بیشتر از مجموع زمان تسک ها باشد. مجموع زمان تسک ها : ' + totalTime + ' دقیقه ');
      result.success = false;
    }

    const notConnectedNodes: NodeDataArrayModel[] = [];
    workFlow.Graph.nodeDataArray.forEach(element => {
      if (workFlow.Graph.linkDataArray) {
        if (!workFlow.Graph.linkDataArray.find(x => x.to === element.key)) {
          notConnectedNodes.push(element);
        }
      }
    });

    if (notConnectedNodes.length > 1) {
      result.messages.push('ساختار درختی گراف درست نیست');
      result.success = false;
    }

    return result;
  }

  checkForNeedNewVersion(workFlow: WorkFlowModel, originalWorkFlow: WorkFlowModel): WorkFlowModel {
    workFlow.NewVersion = false;
    workFlow.versionChangeList = [];
    if (workFlow.Name !== originalWorkFlow.Name) {
      workFlow.versionChangeList.push('تغییر نام فلو');
      workFlow.NewVersion = true;
    }

    if (workFlow.LaunchType !== originalWorkFlow.LaunchType) {
      workFlow.versionChangeList.push('تغییر نوع اجرای فلو');
      workFlow.NewVersion = true;
    }

    if (workFlow.Period !== originalWorkFlow.Period) {
      workFlow.versionChangeList.push('تغییر زمان لازم برای اجرای فرایند');
      workFlow.NewVersion = true;
    }

    if (workFlow.Tasks.length === originalWorkFlow.Tasks.length) {
      let taskChange: boolean;
      for (let i = 0; i < workFlow.Tasks.length; i++) {
        const task = workFlow.Tasks[i];
        const originalTask = originalWorkFlow.Tasks[i];
        if (
          task.Id !== originalTask.Id ||
          task.Name !== originalTask.Name ||
          task.IsEnabled !== originalTask.IsEnabled) {
          taskChange = true;
        }
      }
      if (taskChange) {
        workFlow.versionChangeList.push('تغییر در تسک ها');
        workFlow.NewVersion = true;
      }
    } else {
      workFlow.versionChangeList.push('تغییر در تسک ها');
      workFlow.NewVersion = true;
    }

    if (workFlow.isGraphEdited) {
      workFlow.versionChangeList.push('ویرایش گراف');
      workFlow.NewVersion = true;
    }
    return workFlow;
  }
}
