import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { NodeDataArrayModel } from '../../model/graph.model';
import { LogService } from '../../services/log.service';
import { ListPendingAndDoneModel, RequestNumberUser } from '../../model/listPendingAndDone.model';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-workflow-list-dialog',
  templateUrl: './workflow-list-dialog.component.html',
  styleUrls: ['./workflow-list-dialog.component.css']
})
export class WorkflowListDialogComponent implements OnInit {

  public node: NodeDataArrayModel = new NodeDataArrayModel();
  public workflowId: number;
  public listPendingAndDone: ListPendingAndDoneModel = new ListPendingAndDoneModel();
  public errorMessages: Message[] = [];
  public isLoading: boolean;
  public pendingDataSource = new MatTableDataSource<RequestNumberUser>(this.listPendingAndDone.pendingRequestNumberUsers);
  public doneDataSource = new MatTableDataSource<RequestNumberUser>(this.listPendingAndDone.doneRequestNumberUsers);
  public stopDataSource = new MatTableDataSource<RequestNumberUser>(this.listPendingAndDone.stopRequestNumberUsers);
  public displayedPendingColumns: string[] = ['index', 'RequestNumber', 'UserFullName'];

  constructor(
    private dialogRef: MatDialogRef<WorkflowListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: LogService,
  ) {
    this.node = data.node;
    this.workflowId = data.workflowId;
  }

  @ViewChild('pendingMatPaginator') pendingMatPaginator: MatPaginator;
  @ViewChild('doneMatPaginator') doneMatPaginator: MatPaginator;
  @ViewChild('stopMatPaginator') stopMatPaginator: MatPaginator;

  ngOnInit() {
    this.listPendingAndDoneTasksByUniqKey();
  }

  listPendingAndDoneTasksByUniqKey() {
    this.isLoading = true;
    this.listPendingAndDone = new ListPendingAndDoneModel();
    const donekeys: string[] = [];
    const pendingkeys: string[] = [];
    const stopkeys: string[] = [];
    if (this.node.doneDataModels) {
      this.node.doneDataModels.forEach(element => { donekeys.push(element.UniqKey); });
    }
    if (this.node.pendingDataModels) {
      this.node.pendingDataModels.forEach(element => { pendingkeys.push(element.UniqKey); });
    }
    if (this.node.stopDataModels) {
      this.node.stopDataModels.forEach(element => { stopkeys.push(element.UniqKey); });
    }

    this.service.ListPendingAndDoneTasksByUniqKey(donekeys, pendingkeys, stopkeys).subscribe(
      (res) => {
        this.listPendingAndDone = res;
        this.pendingDataSource = new MatTableDataSource<RequestNumberUser>(this.listPendingAndDone.pendingRequestNumberUsers);
        this.pendingDataSource.paginator = this.pendingMatPaginator;
        this.doneDataSource = new MatTableDataSource<RequestNumberUser>(this.listPendingAndDone.doneRequestNumberUsers);
        this.doneDataSource.paginator = this.doneMatPaginator;
        this.stopDataSource = new MatTableDataSource<RequestNumberUser>(this.listPendingAndDone.stopRequestNumberUsers);
        this.stopDataSource.paginator = this.stopMatPaginator;
        this.setFilterFields();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن جزیات فرایند', });
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      }
    );
  }

  setFilterFields() {
    this.doneDataSource.filterPredicate = function (data, filter): boolean {
      return data.RequestNumber.toString().toLowerCase().includes(filter) || data.UserFullName.toLowerCase().includes(filter);
    };
    this.pendingDataSource.filterPredicate = function (data, filter): boolean {
      return data.RequestNumber.toString().toLowerCase().includes(filter) || data.UserFullName.toLowerCase().includes(filter);
    };
    this.stopDataSource.filterPredicate = function (data, filter): boolean {
      return data.RequestNumber.toString().toLowerCase().includes(filter) || data.UserFullName.toLowerCase().includes(filter);
    };
  }
  selectTask(res: RequestNumberUser) { this.dialogRef.close(res.UniqKey); }
  applyPendingFilter(filterValue: string) { this.pendingDataSource.filter = filterValue.trim().toLowerCase(); }
  applyDoneFilter(filterValue: string) { this.doneDataSource.filter = filterValue.trim().toLowerCase(); }
  applyStopFilter(filterValue: string) { this.stopDataSource.filter = filterValue.trim().toLowerCase(); }
}
