import { Injectable } from '@angular/core';
import { WorkFlowModel } from '../model/workflow.model';
import { TaskNameModel } from '../model/task-name.model';
import { TaskModel } from '../model/task.model';

@Injectable()
export class TaskLogicService {

  constructor() { }

  public fillTaskPersianNames(workFlow: WorkFlowModel, taskNames: TaskNameModel[]) {
    if (workFlow.Tasks.length > 0) {
      for (let task of workFlow.Tasks) {
        if (taskNames.find(x => x.Name === task.Name))
          task.PersianName = taskNames.find(x => x.Name === task.Name).PersianName;
      }
    }
    return workFlow.Tasks;
  }

  removeTaskFromTaskList(tasks: TaskModel[],taskId: number): TaskModel[] {
    return tasks.filter(x => x.Id !== taskId);
  }
}
