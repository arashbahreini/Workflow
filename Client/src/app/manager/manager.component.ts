import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { WorkFlowModel } from '../model/workflow.model';
import { LoadingService } from '../core/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  public workflows: WorkFlowModel[] = [];
  public requestId: number;
  constructor(
    private workflowService: WorkflowService,
    private loading: LoadingService) { }

  ngOnInit() {
    this.getWorkFlows();
  }

  getWorkFlows() {
    this.loading.start();
    this.workflows = [];
    this.workflowService.getWorkFlows().subscribe(
      (res: WorkFlowModel[]) => {
        this.loading.stop();
        this.workflows = res;
      },
      (error: any) => {
        this.loading.stop();
      },
      () => {
        this.loading.stop();
      }
    );
  }

  startWorkFlow(workflow: WorkFlowModel) {
    this.loading.start();
    const data = {
      'Id': workflow.Id,
      'TaskModel': '{\'EmployeeID\':250,' + '\'RequestNumber\': '
        + workflow.requestNumber + ',' + '\'RequestID\': ' + workflow.requestId + ',' + '\'RequestType\':2}'
    };
    this.workflowService.startWorkFlow(data).subscribe(
      (res: any) => {
        this.getWorkFlows();
      },
      (error: any) => { },
      () => {
        this.loading.start();
      }
    );
  }

  stopWorkFlow(workflow: WorkFlowModel) {
    this.workflowService.stopWorkFlow(JSON.stringify(workflow)).subscribe(
      (res: any) => {
        this.getWorkFlows();
      },
      (error: any) => { }
    );
  }

  pauseWorkFlow(id: number) {
    this.workflowService.pouseWorkFlow(id).subscribe(
      (res: any) => {
        this.getWorkFlows();
      },
      (error) => { }
    );
  }

  resumeWorkFlow(id: number) {
    this.workflowService.resumeWorkFlow(id).subscribe(
      (res: any) => {
        this.getWorkFlows();
      },
      (error) => { }
    )
  }
}
