import { Injectable } from '@angular/core';
import { GraphModel, NodeDataToAdd, LinkDataArrayModel } from '../model/graph.model';
import { TaskModel } from '../model/task.model';
import { WorkFlowModel } from '../model/workflow.model';
import { WhileModel } from '../model/while.model';

@Injectable()
export class GraphLogicService {

  constructor() { }

  removeWhileFromWhileGroup(wf: WorkFlowModel, node: TaskModel): WhileModel[] {
    let whileId: any;
    wf.graph.whileGroups.forEach(element => {
      element.taskIds.forEach(taskId => {
        if (taskId === node.key) {
          whileId = element.whileKey;
        }
      });
    });

    wf.graph.whileGroups.forEach(element => {
      if (element.whileKey === whileId) {
        element.taskIds = element.taskIds.filter(x => x !== node.key);
      }
    });
    return wf.graph.whileGroups;
  }

  removeLinksOfRemovedNode(wf: WorkFlowModel, node: TaskModel): LinkDataArrayModel[] {
    if (node.isInWhile) {
      let whileGroup: WhileModel;
      wf.graph.whileGroups.forEach(element => {
        element.taskIds.forEach(taskId => {
          if (taskId === node.key) {
            whileGroup = element;
          }
        });
      });
      if (whileGroup) {
        if (whileGroup.taskIds.length === 1) {
          wf.graph.linkDataArray = wf.graph.linkDataArray.filter(x => x.from !== node.key && x.to !== node.key);
        } else {
          const childNode = wf.graph.nodeDataArray.find(
            x => x.key === wf.graph.linkDataArray.find(xxx => xxx.from === node.key).to);

          // 1. remove link to child.
          wf.graph.linkDataArray = wf.graph.linkDataArray.filter(x => x.from !== node.key);
          // 2. connect parent node to child node.
          wf.graph.linkDataArray.find(x => x.to === node.key).to = childNode.key;
        }
      }
    } else if (node.isWhile) {
      const whileGroup: WhileModel = wf.graph.whileGroups.find(x => x.whileKey === node.key);
      wf.graph.linkDataArray = wf.graph.linkDataArray.filter(x => x.from !== node.key && x.to !== node.key);
      whileGroup.taskIds.forEach(element => {
        wf.graph.linkDataArray = wf.graph.linkDataArray.filter(x => x.from !== element && x.to !== element);
      });
    } else {
      return wf.graph.linkDataArray.filter(x => x.from !== node.key && x.to !== node.key);
    }
    return wf.graph.linkDataArray;
  }
}
