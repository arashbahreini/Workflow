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
    workFlow.graph.nodeDataArray.filter(x => x.isIf).forEach(element => {
      if (workFlow.graph.linkDataArray.find(x => x.to === element.key)) {
        const condition = workFlow.tasks.find(x => x.id === element.taskId);
        const from = workFlow.graph.linkDataArray.find(x => x.to === element.key).from;
        const taskId = workFlow.graph.nodeDataArray.find(x => x.key === from).taskId;
        const parent = workFlow.tasks.find(x => x.id === taskId);

        if (parent.name === 'Forward' || parent.name === 'AddRequestToCartable') {
          if (parent.settings.find(x => x.name === 'کاربر') && condition.settings.find(x => x.name === 'کاربر')) {
            if (parent.settings.find(x => x.name === 'کاربر').value === '') {
              parent.settings.find(x => x.name === 'کاربر').value = '[]';
            }
            const parentUsers = parent.settings.find(x => x.name === 'کاربر').value;
            if (condition.settings.find(x => x.name === 'کاربر').value === '') {
              condition.settings.find(x => x.name === 'کاربر').value = '[]';
            }
            const conditionUsers = condition.settings.find(x => x.name === 'کاربر').value;
            if (JSON.stringify(parentUsers) !== JSON.stringify(conditionUsers)) {
              isUsersMatch.success = false;
              isUsersMatch.value.push(parent);
              isUsersMatch.value.push(condition);
            }
          }

          if (parent.settings.find(x => x.name === 'گروه کاربری') && condition.settings.find(x => x.name === 'گروه کاربری')) {
            if (parent.settings.find(x => x.name === 'گروه کاربری').value === '') {
              parent.settings.find(x => x.name === 'گروه کاربری').value = '[]';
            }
            const parentRoles = parent.settings.find(x => x.name === 'گروه کاربری').value;
            if (condition.settings.find(x => x.name === 'گروه کاربری').value === '') {
              condition.settings.find(x => x.name === 'گروه کاربری').value = '[]';
            }
            const conditionRoles = condition.settings.find(x => x.name === 'گروه کاربری').value;
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
        workFlow.graph.nodeDataArray.find(x => x.taskId === isUsersMatch.value[0].id).key +
        ' و ' +
        workFlow.graph.nodeDataArray.find(x => x.taskId === isUsersMatch.value[1].id).key);
    }

    if (!workFlow.deadLine) {
      result.success = false;
      result.messages.push('برای فرایند هیچ زمانی انتخاب نشده است');
    }

    if (!workFlow.name) {
      result.success = false;
      result.messages.push('فیلد نام خالیست');
    }
    if (workFlow.launchType === null || workFlow.launchType === undefined) {
      result.messages.push('فیلد نوع اجرا خالیست');
      result.success = false;
    }

    if (
      workFlow.launchType === 2 &&
      (workFlow.period === null ||
        workFlow.period === undefined ||
        workFlow.period === '00.00:00:00')) {
      result.messages.push('فیلد بازه خالیست');
      result.success = false;
    }

    if (workFlow.graph) {
      if (workFlow.graph.nodeDataArray.length > 0) {
        const conditions = [];
        workFlow.graph.nodeDataArray.forEach(element => {
          if (element.isIf) {
            conditions.push(element);
          }
        });

        conditions.forEach(element => {
          if (workFlow.graph.linkDataArray.filter(x => x.from === element.key).length < 2) {
            result.messages.push('هر شرط در گراف باید دارای دو فرزند داشته باشد');
            result.success = false;
          }
        });
      }
    }

    let totalTime = 0;
    workFlow.tasks.forEach(element => {
      if (element.settings.find(x => x.name === 'زمان لازم')) {
        totalTime += +element.settings.find(x => x.name === 'زمان لازم').value;
      }
    });

    if (workFlow.deadLine < totalTime) {
      result.messages
        .push('زمان لازم برای اجرای فرایند باید بیشتر از مجموع زمان تسک ها باشد. مجموع زمان تسک ها : ' + totalTime + ' دقیقه ');
      result.success = false;
    }

    const notConnectedNodes: NodeDataArrayModel[] = [];
    workFlow.graph.nodeDataArray.forEach(element => {
      if (workFlow.graph.linkDataArray) {
        if (!workFlow.graph.linkDataArray.find(x => x.to === element.key)) {
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
    workFlow.newVersion = false;
    workFlow.versionChangeList = [];
    if (workFlow.name !== originalWorkFlow.name) {
      workFlow.versionChangeList.push('تغییر نام فلو');
      workFlow.newVersion = true;
    }

    if (workFlow.launchType !== originalWorkFlow.launchType) {
      workFlow.versionChangeList.push('تغییر نوع اجرای فلو');
      workFlow.newVersion = true;
    }

    if (workFlow.period !== originalWorkFlow.period) {
      workFlow.versionChangeList.push('تغییر زمان لازم برای اجرای فرایند');
      workFlow.newVersion = true;
    }

    if (workFlow.tasks.length === originalWorkFlow.tasks.length) {
      let taskChange: boolean;
      for (let i = 0; i < workFlow.tasks.length; i++) {
        const task = workFlow.tasks[i];
        const originalTask = originalWorkFlow.tasks[i];
        if (
          task.id !== originalTask.id ||
          task.name !== originalTask.name ||
          task.isEnabled !== originalTask.isEnabled) {
          taskChange = true;
        }
      }
      if (taskChange) {
        workFlow.versionChangeList.push('تغییر در تسک ها');
        workFlow.newVersion = true;
      }
    } else {
      workFlow.versionChangeList.push('تغییر در تسک ها');
      workFlow.newVersion = true;
    }

    if (workFlow.isGraphEdited) {
      workFlow.versionChangeList.push('ویرایش گراف');
      workFlow.newVersion = true;
    }
    return workFlow;
  }
}
