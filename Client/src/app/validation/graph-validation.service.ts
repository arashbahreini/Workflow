import { Injectable } from '@angular/core';
import { NodeDataToAdd, GraphModel, NodeDataArrayModel } from '../model/graph.model';
import { ResultModel } from '../model/result-model';
import { TaskModel } from '../model/task.model';
import { WhileModel } from '../model/while.model';

@Injectable()
export class GraphValidationService {

  public result: ResultModel = new ResultModel();

  editNodeValidate(task: TaskModel, graph: GraphModel): ResultModel {
    this.result = new ResultModel();

    if (task.parentTask) {
      if (task.parentTask.isIf && task.ifResult === undefined) {
        this.result.success = false;
        this.result.messages.push('هیچ پاسخی انتخاب نشده است');
      }
    }

    return this.result;
  }


  addNodeValidate(task: TaskModel): ResultModel {
    let selectedEmploys = [];
    let selectedRoles = [];
    this.result = new ResultModel();

    if (task.settings.length > 0) {
      if (task.settings.find(x => x.name === 'کاربر')) {
        selectedEmploys = task.settings.find(x => x.name === 'کاربر').value;
      }
      if (task.settings.find(x => x.name === 'گروه کاربری')) {
        selectedRoles = task.settings.find(x => x.name === 'گروه کاربری').value;
      }
    }

    if (task.parentTask) {
      if (!task.parentTask.isInWhile) {
        if (task.parentTask.isIf && task.ifResult === undefined) {
          this.result.success = false;
          this.result.messages.push('هیچ پاسخی انتخاب نشده است');
        }
      }
    }

    if (task.parentTask.isWhile && task.whileResult === undefined) {
      this.result.success = false;
      this.result.messages.push('هیچ پاسخی انتخاب نشده است');
    }

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
    return this.result;
  }

  saveLink(graph: GraphModel, task: TaskModel, linkTask: NodeDataArrayModel): ResultModel {
    this.result = new ResultModel();

    if (!linkTask) {
      this.result.messages.push('هیچ فرزندی انتخاب نشده است');
      this.result.success = false;
    }

    if (task.isIf && (task.ifResult === undefined || task.ifResult === null)) {
      this.result.messages.push('هیچ پاسخی برای این شرط انتخاب نشده است');
      this.result.success = false;
    }
    return this.result;
  }

  openLinkPanelValidation(graph: GraphModel, task: TaskModel): ResultModel {
    this.result = new ResultModel();
    if (task.isIf === true) {
      if (graph.linkDataArray.filter(x => x.from === task.key).length > 1) {
        this.result.messages.push('این کار نمیتواند بیشتر از دو فرزند داشته باشد');
        this.result.success = false;
      }
    } else if (task.isIf === false) {
      if (graph.linkDataArray.filter(x => x.from === task.key).length > 0) {
        this.result.messages.push('این کار نمیتواند بیشتر از یک فرزند داشته باشد');
        this.result.success = false;
      }
    }

    if (graph.nodeDataArray.length <= 1) {
      this.result.messages.push('هیچ کاری برای فرزند در گراف وجود ندارد');
      this.result.success = false;
    }
    return this.result;
  }

  openAddPanelValidation(graph: GraphModel, task: TaskModel, whileGroups: WhileModel[]) {
    this.result = new ResultModel();

    if (task.parentTask.isIf) {
      {
        if (graph.linkDataArray) {
          if (task.parentTask.isInWhile) {
            let isNextNodeWhile;
            graph.linkDataArray.filter(x => x.from === task.parentTask.key).forEach(element => {
              if (graph.nodeDataArray.find(x => x.key === element.to).isWhile) {
                isNextNodeWhile = true;
              }
            });
            let valueForCondition;
            if (isNextNodeWhile) {
              valueForCondition = 3;
            } else {
              valueForCondition = 2;
            }
            if (graph.linkDataArray.filter(x => x.from === task.parentTask.key).length > valueForCondition) {
              this.result.messages.push('فرزندان این کار به حد اقل رسیده اند');
              this.result.success = false;
            }
          } else {
            if (graph.linkDataArray.filter(x => x.from === task.parentTask.key).length > 1) {
              this.result.messages.push('فرزندان این کار به حد اقل رسیده اند');
              this.result.success = false;
            }
          }
        }
      }
    } else if (task.parentTask.isWhile || task.parentTask.isInWhile) {
      if (!task.parentTask.isSwitch) {
        if (graph.linkDataArray.filter(x => x.from === task.parentTask.key && x.to).length > 1) {
          this.result.messages.push('فرزندان این کار به حد اقل رسیده اند');
          this.result.success = false;
        }
      }
    } else {
      if (!task.parentTask.isSwitch) {
        if (graph.linkDataArray) {
          if (graph.linkDataArray.filter(x => x.from === task.parentTask.key).length > 0) {
            this.result.messages.push('فرزندان این کار به حد اقل رسیده اند');
            this.result.success = false;
          }
        }
      }
    }
    return this.result;
  }
}
