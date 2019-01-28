import { Injectable } from '@angular/core';
import { WorkFlowModel } from '../model/workflow.model';
import { TaskNameModel } from '../model/task-name.model';
import { TaskModel } from '../model/task.model';

@Injectable()
export class TaskLogicService {

  constructor() { }

  public fillTaskPersianNames(workFlow: WorkFlowModel, taskNames: TaskNameModel[]) {
    if (workFlow.tasks.length > 0) {
      for (const task of workFlow.tasks) {
        if (taskNames.find(x => x.name === task.name)) {
          task.persianName = taskNames.find(x => x.name === task.name).persianName;
        }
      }
    }
    return workFlow.tasks;
  }

  removeTaskFromTaskList(tasks: TaskModel[], taskId: number): TaskModel[] {
    return tasks.filter(x => x.id !== taskId);
  }
}
