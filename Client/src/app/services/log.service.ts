import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LogModel } from '../model/log.model';
import { catchError, map, tap, take } from 'rxjs/operators';
import { WorkflowLogRequestModel } from '../model/workflow-log-request.model';
import { throwError, Observable } from 'rxjs';
import { WorkFlowModel } from '../model/workflow.model';

@Injectable()
export class LogService {

  public url = '/WorkflowLog/';

  constructor(private http: HttpClient) { }

  getWorkflowLogByUniqKey(uniqKey: string) {
    return this.http.post<LogModel[]>(this.url + 'GetWorkflowLogByUniqKey', { UniqKey: uniqKey }).pipe(
      catchError(this.handleError),
    );
  }

  getWorkflowDetail(uniqKey: string) {
    return this.http.post<WorkFlowModel>(this.url + 'GetWorkflowDetail', { UniqKey: uniqKey }).pipe(
      catchError(this.handleError),
    );
  }

  getWorkflowsSummary(model: WorkFlowModel) {
    return this.http.post<LogModel[]>(this.url + 'GetWorkflowsSummary', model).pipe(
      catchError(this.handleError),
    );
  }

  getWorkflowList() {
    return this.http.get<any>(this.url + 'GetWorkflowNames').pipe(
      catchError(this.handleError),
    );
  }

  ListPendingAndDoneTasksByUniqKey(doneKeys: string[], pendingKeys: string[], stopKeys: string[]) {
    return this.http.post<any>(this.url + 'ListPendingAndDoneTasksByUniqKey'
      , { DoneKeys: doneKeys, PendingKeys: pendingKeys, StopKeys: stopKeys }).pipe(
        catchError(this.handleError),
      );
  }

  getStartedWorkflowLogs(data: WorkflowLogRequestModel): Observable<LogModel[]> {
    return this.http.post<LogModel[]>(this.url + 'GetStartedWorkflowLogs', data).pipe(
      catchError(this.handleError),
    );
  }

  getSinglePageWorkflowLog(data: WorkflowLogRequestModel): Observable<LogModel[]> {
    return this.http.post<LogModel[]>(this.url + 'GetSinglePageWorkflowLog', data).pipe(
      catchError(this.handleError),
    );
  }

  getPendingTasksByWorkflowId(data: number): Observable<LogModel[]> {
    return this.http.post<LogModel[]>(this.url + 'GetPendingTasksByWorkflowId', { Id: data }).pipe(
      catchError(this.handleError),
    );
  }

  getFinishedWorkflowLogs(data: WorkflowLogRequestModel): Observable<LogModel[]> {
    return this.http.post<LogModel[]>(this.url + 'GetFinishedWorkflowLogs', data).pipe(
      catchError(this.handleError),
    );
  }

  getWorkflowErrorLogs(data: WorkflowLogRequestModel): Observable<LogModel[]> {
    return this.http.post<LogModel[]>(this.url + 'GetWorkflowErrorLogs', data).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 200) {
      return throwError(error.status + '  ' + error.statusText);
    }
  }
}
