import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('pendingMatPaginator') pendingMatPaginator: MatPaginator;
  public pendingDataSource = new MatTableDataSource<WorkFlowModel>(this.workflows);
  public displayedPendingColumns: string[] = ['index', 'id', 'version', 'name', 'deadLine', 'period', 'requestNumber', 'options'];

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
        this.pendingDataSource = new MatTableDataSource<WorkFlowModel>(this.workflows);
        this.pendingDataSource.paginator = this.pendingMatPaginator;
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
    this.workflowService.startWorkFlow({ id: workflow.id }).subscribe(
      (res: any) => {
        this.loading.stop();
      },
      (error: any) => {
        this.loading.stop();
      },
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
