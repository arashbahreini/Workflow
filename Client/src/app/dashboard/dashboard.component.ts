import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LogService } from '../services/log.service';
import { WorkflowSummaryModel } from '../model/workflow-summary.model';
import { LoadingService } from '../core/loading-dialog/loading-dialog.component';
import { Message, } from '../../../node_modules/primeng/components/common/api';
import { WorkFlowModel } from '../model/workflow.model';
import { GraphModel } from '../model/graph.model';
import 'chart.piecelabel.js';
import { PersianNumberPipe } from '../pipes/persian-number.pipe';
import { NameIdModel } from '../model/name-id.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  public workflowSummaries: WorkflowSummaryModel[] = [];
  public workflowList: NameIdModel[] = [];
  public workflowSummary: WorkflowSummaryModel = new WorkflowSummaryModel();
  public errorMessages: Message[] = [];
  public pieOptions: any;
  public hideCharts = false;
  public showPendingGraph = false;
  public showWorkflowDetail = false;
  public workFlow: WorkFlowModel = new WorkFlowModel();
  public persianNumber: PersianNumberPipe = new PersianNumberPipe();
  public uniqKey: string;
  public dashboardText: string;

  constructor(
    private logService: LogService,
    private loading: LoadingService
  ) {

    this.pieOptions = {
      onClick: () => { },
      tooltips: {
        enabled: false,
      },
      pieceLabel: {
        render: 'value',
        fontSize: 14,
        fontStyle: 'bold',
        fontColor: '#ffffff',
        fontFamily: 'IranianSansRegular'
      },
      title: {
        display: true,
      },
      legend: {
        position: 'top',
        labels: {
          fontFamily: 'IranianSansRegular',
        },
      },
      hover: {
        onHover: function (e) {
          const point = this.getElementAtEvent(e);
          if (point.length) {
            e.target.style.cursor = 'pointer';
          } else {
            e.target.style.cursor = 'default';
          }
        }
      }
    };
  }
  ngOnInit() {
    this.getWorkflowList();
  }

  showWorkflowSummaryGraph(event) {
    this.workflowSummary = event.element._chart.config.data;
    this.hideCharts = true;
    this.showPendingGraph = true;
    this.dashboardText = ' - گزارش کلی فرایند ها';
  }

  showCharts() {
    this.hideCharts = false;
    this.showPendingGraph = false;
    // this.getWorkflowsSummary();
    this.dashboardText = '';
  }

  showkflowDetail() {
    this.showPendingGraph = true;
    this.showWorkflowDetail = false;
    this.dashboardText = ' - گزارش کلی فرایند ها';
  }

  getWorkflowList() {
    this.loading.start();
    this.workflowList = [];
    this.logService.getWorkflowList().subscribe(
      (res: any) => {
        this.workflowList = res;
        this.workflowSummaries = [];
        this.workflowList.forEach(element => {
          this.getWorkflowsSummary(element);
        });
        this.loading.stop();
      },
      () => {
        this.loading.stop();
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن گزارش فرایند ها', });
      },
      () => {
        this.loading.stop();
      }
    );
  }

  getWorkflowsSummary(workflow: NameIdModel) {
    const item: WorkflowSummaryModel = new WorkflowSummaryModel();
    item.workflowName = workflow.name;
    item.isLoading = true;
    this.workflowSummaries.push(item);
    debugger;
    this.logService.getWorkflowsSummary(workflow.id).subscribe(
      (res: any) => {
        const index = this.workflowSummaries.indexOf(item);
        this.workflowSummaries[index] = res.length ? res[0] : new WorkflowSummaryModel();
        this.workflowSummaries[index].isLoading = false;
      },
      () => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن گزارش فرایند ها', });
      },
      () => {
      }
    );
  }

  onShowWorkflowDetail(uniqKey: string) {
    this.uniqKey = uniqKey;
    this.showPendingGraph = false;
    this.showWorkflowDetail = true;
    this.dashboardText = ' - گزارش فرایند';
  }
}
