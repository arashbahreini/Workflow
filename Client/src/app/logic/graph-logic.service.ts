import { Injectable } from '@angular/core';
import { GraphModel, NodeDataToAdd, LinkDataArrayModel } from '../model/graph.model';
import { TaskModel } from '../model/task.model';
import { WorkFlowModel } from '../model/workflow.model';
import { WhileModel } from '../model/while.model';

@Injectable()
export class GraphLogicService {

  constructor() { }

  removeWhileFromWhileGroup(wf: WorkFlowModel, node: TaskModel): WhileModel[] {
    let whileId;
    wf.Graph.whileGroups.forEach(element => {
      element.taskIds.forEach(taskId => {
        if (taskId === node.key) whileId = element.whileKey;
      });
    });

    wf.Graph.whileGroups.forEach(element => {
      if (element.whileKey === whileId) {
        element.taskIds = element.taskIds.filter(x => x !== node.key);
      }
    });
    return wf.Graph.whileGroups;
  }

  removeLinksOfRemovedNode(wf: WorkFlowModel, node: TaskModel): LinkDataArrayModel[] {
    if (node.isInWhile) {
      let whileGroup: WhileModel;
      wf.Graph.whileGroups.forEach(element => {
        element.taskIds.forEach(taskId => {
          if (taskId === node.key) whileGroup = element;
        });
      });
      if (whileGroup) {
        if (whileGroup.taskIds.length === 1) {
          wf.Graph.linkDataArray = wf.Graph.linkDataArray.filter(x => x.from !== node.key && x.to != node.key);
        } else {
          let childNode = wf.Graph.nodeDataArray.find(
            x => x.key === wf.Graph.linkDataArray.find(x => x.from === node.key).to);

          // 1. remove link to child.
          wf.Graph.linkDataArray = wf.Graph.linkDataArray.filter(x => x.from !== node.key);
          // 2. connect parent node to child node.
          wf.Graph.linkDataArray.find(x => x.to === node.key).to = childNode.key;
        }
      }
    } else if (node.isWhile) {
      let whileGroup: WhileModel = wf.Graph.whileGroups.find(x => x.whileKey === node.key);
      wf.Graph.linkDataArray = wf.Graph.linkDataArray.filter(x => x.from != node.key && x.to != node.key);
      whileGroup.taskIds.forEach(element => {
        wf.Graph.linkDataArray = wf.Graph.linkDataArray.filter(x => x.from != element && x.to != element);
      });
    } else {
      return wf.Graph.linkDataArray.filter(x => x.from != node.key && x.to != node.key);
    }
    return wf.Graph.linkDataArray;
  }
}
