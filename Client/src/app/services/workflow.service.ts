
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WorkFlowModel } from '../model/workflow.model';
import { Http, Headers, Response, RequestOptions, RequestMethod } from '@angular/http';
import { LunchTypeModel } from '../model/lunch-type.model';
import { TaskModel } from '../model/task.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, take, observeOn } from 'rxjs/operators';
import { TaskNameModel } from '../model/task-name.model';
import { version } from 'punycode';
import { IdVersionModel } from '../model/id-version.model';
import { CommonTaskModel } from '../model/common-task.model';
import { TaskTypeModel } from '../model/task-type.model';
import { ResultModel } from '../model/result-model';

@Injectable()
export class WorkflowService {

  // public url = 'http://localhost:42991/Workflow/';
  // public url = 'http://172.16.25.52/Workflow/';
  public url = '/Workflow/';

  constructor(private http: HttpClient) { }

  getWorkFlows(): Observable<WorkFlowModel[]> {
    return this.http.get<WorkFlowModel[]>(this.url + 'GetWorkFlows');
  }

  getHistoryWorkFlows(workflowId: number): Observable<WorkFlowModel[]> {
    return this.http.post<WorkFlowModel[]>(this.url + 'GetHistoryWorkflows', { Id: workflowId });
  }

  saveWorkflow(data: any) {
    return this.http.post(this.url + 'SaveWorkFlow', data)
      .pipe(
        catchError(this.handleError),
      );
  }

  saveGraph(data: any) {
    return this.http.post(this.url + 'SaveGraph', data)
      .pipe(
        catchError(this.handleError),
      );
  }

  getLunchTypes() {
    const lunchTypes: LunchTypeModel[] = [
      {
        title: 'در شروع برنامه',
        name: 'Startup',
        id: 0
      },
      {
        title: 'به دستور کاربر',
        name: 'Trigger',
        id: 1
      },
      {
        title: 'در بازه ی مشخص',
        name: 'Priodic',
        id: 2
      },
    ];

    return lunchTypes;
  }

  getJsonGraph(data: IdVersionModel) {
    return this.http.post(this.url + 'GetExecutionGraph', data).pipe(
      catchError(this.handleError),
    );
  }

  getTaskNames(): Observable<TaskNameModel[]> {
    return this.http.get<TaskNameModel[]>(this.url + 'GetTaskNames').pipe(
      catchError(this.handleError),
    );
  }

  getTasks(id: number, version: number): Observable<TaskModel[]> {
    return this.http.post<TaskModel[]>(this.url + 'GetTasks', { id: id, version: version }).pipe(
      catchError(this.handleError),
    );
  }

  getWorkFlow(id: number, version: number): Observable<WorkFlowModel> {
    return this.http.post<WorkFlowModel>(this.url + 'GetWorkflow/', { id: id, version: version }).pipe(
      catchError(this.handleError),
    );
  }

  startWorkFlow(data: any) {
    return this.http.post(this.url + 'StartCustomWorkFlow', data).pipe(
      catchError(this.handleError),
    );
  }

  stopWorkFlow(data: string) {
    return this.http.post(this.url + 'StopCustomFlow', data).pipe(
      catchError(this.handleError),
    );
  }

  pouseWorkFlow(id: number) {
    return this.http.post(this.url + 'suspend/' + id, null).pipe(
      catchError(this.handleError),
    );
  }

  resumeWorkFlow(id: number) {
    return this.http.post(this.url + 'resume/' + id, null).pipe(
      catchError(this.handleError),
    );
  }

  getSettingNames(name: string): Observable<string[]> {
    return this.http.post<string[]>(this.url + 'GetSettings/' + '?name=' + name, null).pipe(
      catchError(this.handleError),
    );
  }

  deleteWorkflow(id: number, version: number) {
    return this.http.post(this.url + 'DeleteWorkflow', { id: id, version: version }).pipe(
      catchError(this.handleError),
    );
  }

  getWorkflowXml(id: number, version: number) {
    return this.http.post(this.url + 'GetWorkflowXml', { id: id, version: version }).pipe(
      catchError(this.handleError),
    );
  }

  getEmploys() {
    return this.http.post(this.url + 'GetEmployes', null).pipe(
      catchError(this.handleError),
    );
  }

  getCommonTasks() {
    let data: CommonTaskModel[] = [{
      persianName: 'ارجاع به کارتابل',
      englishName: 'Forward'
    },
    {
      persianName: 'افزودن به کارتابل',
      englishName: 'AddRequestToCartable'
    }];
    return data;
  }

  getRoles() {
    return this.http.post(this.url + 'GetRoles', null).pipe(
      catchError(this.handleError),
    );
  }

  getTaskTypes() {
    let data: TaskTypeModel[] = [];

    data.push({
      name: 'if',
      description: 'شرط'
    });

    data.push({
      name: 'commonTask',
      description: 'متداول'
    });

    data.push({
      name: 'task',
      description: 'کار'
    });

    data.push({
      name: 'while',
      description: 'حلقه'
    });

    data.push({
      name: 'switch',
      description: 'چند شرطی'
    });

    return data;
  }

  getTaskXml(task: TaskModel) {
    return this.http.post(this.url + 'GetTaskXml/', task).pipe(
      catchError(this.handleError),
    );
  }

  getLastVersionWorkFlow(id: number): Observable<WorkFlowModel> {
    return this.http.post<WorkFlowModel>(this.url + 'GetLastVersionWorkflow/', { id: id }).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 200)
      //return new ErrorObservable(error.status + '  ' + error.statusText);
      return observableThrowError(error.status + '  ' + error.statusText);
  }
}
