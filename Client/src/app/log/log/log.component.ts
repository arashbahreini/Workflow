import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LogModel } from '../../model/log.model';
import { LogService } from '../../services/log.service';
import { WorkflowTypeModel } from '../../model/workflow-type.model';
import { WorkflowLogRequestModel } from '../../model/workflow-log-request.model';
import { Message } from 'primeng/components/common/api';
import { timer, Subscription } from "rxjs";
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { GraphLogComponent } from '../graph-log/graph-log.component';
import { takeWhile, map } from 'rxjs/operators';
import { CommonServicesService } from '../../services/common-services.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})

export class LogComponent implements OnInit, OnDestroy {

  public isLoading: boolean;
  public workflowTypes: WorkflowTypeModel[] = [];
  public logRequest: WorkflowLogRequestModel = new WorkflowLogRequestModel();
  public errorMessages: Message[] = [];
  public aliveStart: boolean;
  public aliveFinished: boolean;
  public searchStartedLogRequest: WorkflowLogRequestModel = new WorkflowLogRequestModel();
  public hasResult: boolean = true;
  public sub: Subscription = new Subscription();
  public aliveErrors: boolean;
  public workflowLogs: LogModel[] = [];
  public workflowLogsSource = new MatTableDataSource<LogModel>(this.workflowLogs);
  public displayedWorkflowColumns: string[] = ['index', 'WorkflowName', 'RequestNumber', 'WorkflowVersion', 'CurrentTaskName', 'TaskRemainTime', 'WorkflowRemainTime'];
  public displayedFinishedWorkflowColumns: string[] = ['index', 'WorkflowName', 'RequestNumber', 'WorkflowVersion', 'CurrentTaskName', 'TimeWasted'];

  constructor(
    private logService: LogService,
    private dialog: MatDialog,
    private commonService: CommonServicesService
  ) { }

  @ViewChild('WorkflowMatPaginator') WorkflowMatPaginator: MatPaginator;
  @ViewChild('WorkflowFinishMatPaginator') WorkflowFinishMatPaginator: MatPaginator;
  
  ngOnInit() {
    this.getWorkflowTypes();
  }

  ngOnDestroy() {
    this.aliveFinished = false;
    this.aliveStart = false;
  }

  getStartedWorkflowLogs() {
    if (!this.logRequest.typeId) {
      this.showErrorMessage('هیچ فرایندی انتخاب نشده است');
      return;
    }
    this.aliveStart = false;
    this.isLoading = true;
    this.workflowLogs = [];
    this.logService.getStartedWorkflowLogs(this.logRequest).subscribe(
      (res: LogModel[]) => {
        this.hasResult = res.length > 0;
        if (res.length > 0) {
          this.workflowLogs = res;
          this.workflowLogsSource = new MatTableDataSource<LogModel>(this.workflowLogs);
          this.workflowLogsSource.paginator = this.WorkflowMatPaginator;
        }
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        this.showErrorMessage('خطا در دریافت گزارش' + error);
      }
    )
  }

  getFinishedWorkflowLogs() {
    if (!this.logRequest.typeId) {
      this.showErrorMessage('هیچ فرایندی انتخاب نشده است');
      return;
    }
    this.aliveFinished = false;
    this.isLoading = true;
    this.workflowLogs = [];
    this.workflowLogsSource = new MatTableDataSource<LogModel>();
    this.logService.getFinishedWorkflowLogs(this.logRequest).subscribe(
      (res: LogModel[]) => {
        this.hasResult = res.length > 0;
        if (res.length > 0) {
          this.workflowLogs = res;
          this.workflowLogsSource = new MatTableDataSource<LogModel>(this.workflowLogs);
          this.workflowLogsSource.paginator = this.WorkflowFinishMatPaginator;
          //this.liveFinishtWorkflowLogsContinusely();
        } else this.workflowLogsSource = new MatTableDataSource<LogModel>();
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        this.showErrorMessage('خطا در دریافت گزارش' + error);
      }
    )
  }

  getWorkflowErrorLogs() {
    if (!this.logRequest.typeId) {
      this.showErrorMessage('هیچ فرایندی انتخاب نشده است');
      return;
    }
    this.aliveErrors = false;
    this.isLoading = true;
    this.workflowLogsSource = new MatTableDataSource<LogModel>();
    this.logService.getWorkflowErrorLogs(this.logRequest).subscribe(
      (res: LogModel[]) => {
        this.hasResult = res.length > 0;
        if (res.length > 0) {
          this.workflowLogsSource = new MatTableDataSource<LogModel>(res);
          this.liveWorkflowErrorLogsContinusely();
        }
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        this.showErrorMessage('خطا در دریافت گزارش' + error);
      }
    )
  }

  searchStartedWorkflowLogs() {
    if (!this.logRequest.typeId) {
      this.showErrorMessage('هیچ فرایندی انتخاب نشده است');
      return;
    }
    this.aliveStart = false;
    this.isLoading = true;
    this.workflowLogsSource = new MatTableDataSource<LogModel>();
    this.workflowLogs = [];
    this.sub.unsubscribe();
    this.logRequest.RequestNumber = this.searchStartedLogRequest.RequestNumber;
    this.logService.getStartedWorkflowLogs(this.logRequest).subscribe(
      (res: LogModel[]) => {
        this.workflowLogs = res;
        this.workflowLogsSource = new MatTableDataSource<LogModel>(this.workflowLogs);
        this.workflowLogsSource.paginator = this.WorkflowMatPaginator;
        this.hasResult = res.length > 0;
        // this.liveStartWorkflowLogsContinusely();
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        this.showErrorMessage('خطا در دریافت گزارش' + error);
      }
    )
  }

  searchFinishedWorkflowLogs() {
    if (!this.logRequest.typeId) {
      this.showErrorMessage('هیچ فرایندی انتخاب نشده است');
      return;
    }
    this.aliveFinished = false;
    this.isLoading = true;
    this.workflowLogsSource = new MatTableDataSource<LogModel>();
    this.workflowLogs = [];
    this.sub.unsubscribe();
    this.logRequest.RequestNumber = this.searchStartedLogRequest.RequestNumber;
    this.logService.getFinishedWorkflowLogs(this.logRequest).subscribe(
      (res: LogModel[]) => {
        this.workflowLogs = res;
        this.workflowLogsSource = new MatTableDataSource<LogModel>(this.workflowLogs);
        this.workflowLogsSource.paginator = this.WorkflowFinishMatPaginator;
        this.hasResult = res.length > 0;
        // this.liveFinishtWorkflowLogsContinusely();
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        this.showErrorMessage('خطا در دریافت گزارش' + error);
      }
    )
  }

  searchWorkflowErrorLogs() {
    if (!this.logRequest.typeId) {
      this.showErrorMessage('هیچ فرایندی انتخاب نشده است');
      return;
    }
    this.aliveFinished = false;
    this.isLoading = true;
    this.workflowLogsSource = new MatTableDataSource<LogModel>();
    this.sub.unsubscribe();
    this.logRequest.RequestNumber = this.searchStartedLogRequest.RequestNumber;
    this.logService.getWorkflowErrorLogs(this.logRequest).subscribe(
      (res: LogModel[]) => {
        this.workflowLogsSource = new MatTableDataSource<LogModel>(res);
        this.hasResult = res.length > 0;
        this.liveWorkflowErrorLogsContinusely();
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        this.showErrorMessage('خطا در دریافت گزارش' + error);
      }
    )
  }

  liveWorkflowErrorLogsContinusely() {
    this.aliveErrors = true;
    timer(0, 15000).pipe(takeWhile(() => this.aliveErrors))
      .subscribe(
        () => {
          if (this.hasResult) {
            this.sub = this.logService.getWorkflowErrorLogs(this.logRequest).subscribe(
              (res: LogModel[]) => {
                this.workflowLogsSource = new MatTableDataSource<LogModel>(res);
              },
              (error) => {
                this.aliveErrors = false;
                this.showErrorMessage('خطا در بروز رسانی لیست' + error)
              });
          }
        }
      )
  }

  liveFinishtWorkflowLogsContinusely() {
    this.aliveFinished = true;
    timer(0, 15000).pipe(takeWhile(() => this.aliveFinished))
      .subscribe(
        () => {
          if (this.hasResult) {
            this.sub = this.logService.getFinishedWorkflowLogs(this.logRequest).subscribe(
              (res: LogModel[]) => {
                this.workflowLogsSource = new MatTableDataSource<LogModel>(res);
              },
              (error) => {
                this.aliveFinished = false;
                this.showErrorMessage('خطا در بروز رسانی لیست' + error)
              });
          }
        }
      )
  }

  liveStartWorkflowLogsContinusely() {
    this.aliveStart = true;
    timer(0, 15000).pipe(takeWhile(() => this.aliveStart))
      .subscribe(
        () => {
          if (this.hasResult) {
            this.sub = this.logService.getStartedWorkflowLogs(this.logRequest).subscribe(
              (res: LogModel[]) => {
                this.workflowLogsSource = new MatTableDataSource<LogModel>(res);
              },
              (error) => {
                this.aliveStart = false;
                this.showErrorMessage('خطا در بروز رسانی لیست' + error)
              });
          }
        }
      )
  }

  public showErrorMessage(messages: string) {
    this.errorMessages = [];
    this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: messages });
  }

  getWorkflowTypes() {
    this.workflowTypes = [];
    this.workflowTypes = this.commonService.getCartableTypes();
    
    // this.workflowTypes.push(
    //   {
    //     id: 1,
    //     name: 'بازاریابی'
    //   },
    //   {
    //     id: 2,
    //     name: 'ابطال'
    //   }, {
    //     id: 3,
    //     name: 'تخصیص'
    //   }, {
    //     id: 4,
    //     name: 'تغییر شماره حساب'
    //   }, {
    //     id: 5,
    //     name: 'تغییر آدرس و کدپستی و صنف'
    //   }, {
    //     id: 6,
    //     name: 'تغییر اطلاعات شاپرکی پذیرنده'
    //   }, {
    //     id: 7,
    //     name: 'تغییر سرویسهای ترمینال'
    //   }, {
    //     id: 8,
    //     name: 'تغییر اطلاعات داخلی پذیرنده'
    //   },
    // );
  }

  openGraph(data: LogModel, isFinishedWorkflow: boolean) {
    data.isFinishedWorkflow = isFinishedWorkflow;
    let dialogRef = this.dialog.open(GraphLogComponent, {
      data: data,
      width: '50%',
      disableClose: true,
    });
  }

  clear() {
    this.sub.unsubscribe();
    this.logRequest = new WorkflowLogRequestModel();
    this.workflowLogsSource = new MatTableDataSource<LogModel>();
    this.aliveStart = false;
    this.aliveFinished = false;
    this.aliveErrors = false;
    this.hasResult = true;
    this.workflowLogs = [];
  }
}
