import { Component, OnInit } from '@angular/core';
import { WorkFlowModel } from '../model/workflow.model';
import { WorkflowService } from '../services/workflow.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { LoadingService } from '../core/loading-dialog/loading-dialog.component';
import { WorkflowLogRequestModel } from '../model/workflow-log-request.model';
import { WorkflowTypeModel } from '../model/workflow-type.model';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css'],
  providers: [MessageService],
})
export class DesignerComponent implements OnInit {
  public workflowTypes: WorkflowTypeModel[] = [];
  public workflows: WorkFlowModel[] = [];
  public historyWorkflows: WorkFlowModel[] = [];
  public errorMessages: Message[] = [];
  public workflowRequest: WorkflowLogRequestModel = new WorkflowLogRequestModel();
  public hasResult: boolean;

  constructor(
    private workflowService: WorkflowService,
    private route: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.getWorkFlows();
    this.getWorkflowTypes();
  }

  getWorkFlows() {
    this.loading.start();
    this.workflows = [];
    this.workflowService.getWorkFlows().subscribe(
      (res: WorkFlowModel[]) => {
        this.workflows = res;
      },
      (error: any) => {
        this.loading.stop();
      },
      () => {
        this.loading.stop();
      }
    )
  }

  getHistoryWorkFlows() {
    this.loading.start();
    this.historyWorkflows = [];
    this.workflowService.getHistoryWorkFlows(this.workflowRequest.typeId).subscribe(
      (res: WorkFlowModel[]) => {
        this.historyWorkflows = res;
        this.hasResult = this.historyWorkflows.length !== 0;
      },
      (error: any) => {
        this.loading.stop();
      },
      () => {
        this.loading.stop();
      }
    )
  }

  getWorkflowTypes() {
    this.workflowTypes = [];
    this.workflowTypes.push(
      {
        id: 1,
        name: 'بازاریابی'
      },
      {
        id: 2,
        name: 'ابطال'
      }, {
        id: 3,
        name: 'تخصیص'
      }, {
        id: 4,
        name: 'تغییر شماره حساب'
      }, {
        id: 5,
        name: 'تغییر آدرس و کدپستی و صنف'
      }, {
        id: 6,
        name: 'تغییر اطلاعات شاپرکی پذیرنده'
      }, {
        id: 7,
        name: 'تغییر سرویسهای ترمینال'
      }, {
        id: 8,
        name: 'تغییر اطلاعات داخلی پذیرنده'
      },
    );
  }

  openDeleteDialog(workflowId: number, version: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: true,
      data: 'آیا از حذف این فرایند اطمینان دارید ؟ ',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteWorkflow(workflowId, version);
      }
    });
  }

  deleteWorkflow(workflowId: number, version: number) {
    this.workflowService.deleteWorkflow(workflowId, version).subscribe(
      (res: any) => {
        if (res) {
          this.errorMessages.push({ severity: 'success', summary: 'پیغام موفق', detail: 'فرایند با موفقیت حذف شد', })
        } else {
          this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'مشکلی در سیستم وجود دارد', })
        }
        this.getWorkFlows();
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: error, })
      }
    )
  }
}
