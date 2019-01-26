import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { WorkflowSummaryModel } from '../../model/workflow-summary.model';
import { WorkFlowModel } from '../../model/workflow.model';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { LogService } from '../../services/log.service';
import * as go from 'gojs';
import { Message } from 'primeng/components/common/api';
import { GraphModel, NodeDataArrayModel } from '../../model/graph.model';
import { MatDialog } from '@angular/material';
import { WorkflowListDialogComponent } from '../workflow-list-dialog/workflow-list-dialog.component';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';


@Component({
  selector: 'app-pending-task-graph',
  templateUrl: './pending-task-graph.component.html',
  styleUrls: ['./pending-task-graph.component.css']
})
export class PendingTaskGraphComponent implements OnInit {

  @ViewChild('myDiagramDiv') element: ElementRef;
  @Input() data: WorkflowSummaryModel = new WorkflowSummaryModel();
  @Output() showWorkflowDetail = new EventEmitter<string>();

  public e: any;
  public obj: any;
  public workFlow: WorkFlowModel = new WorkFlowModel();
  public myDiagram: go.Diagram;
  public errorMessages: Message[] = [];
  public selectedNode: NodeDataArrayModel = new NodeDataArrayModel();

  constructor(
    private dialog: MatDialog,
    private logService: LogService,
    private loading: LoadingService,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    this.getPendingTasksByWorkflowId();
    this.errorMessages.forEach(element => {

    });
  }

  getPendingTasksByWorkflowId() {
    this.workFlow = new WorkFlowModel();
    this.loading.start();
    this.logService.getPendingTasksByWorkflowId(this.data.WorkflowId).subscribe(
      (res: any) => {
        this.workFlow = res;
        this.properTaskDescription();
        this.graphInitializer();
        this.loading.stop();
      },
      (error) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن جزیات فرایند', });
        this.loading.stop();
      },
      () => this.loading.stop()
    );
  }

  properTaskDescription() {
    this.workFlow.Graph.nodeDataArray.forEach(element => {
      element.pendingDescription = 'در حال اجرا : ' + element.pendingNumber;
    });

    this.workFlow.Graph.nodeDataArray.forEach(element => {
      element.doneDescription = 'انجام شده : ' + element.doneNumber;
    });

    this.workFlow.Graph.nodeDataArray.forEach(element => {
      element.stopDescription = 'متوقف شده : ' + element.stopNumber;
    });
  }

  //#region graphInitializer
  public graphInitializer() {
    const $ = go.GraphObject.make;
    this.myDiagram =
      $(go.Diagram, this.element.nativeElement,  // must name or refer to the DIV HTML element
        {
          // start everything in the middle of the
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
          layout: $(go.LayeredDigraphLayout,
            {
              columnSpacing: 5,
              setsPortSpots: false,
              direction: 90,
              layerSpacing: 20,
            })
        });

    this.myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, 'RoundedRectangle',
          {
            parameter1: 20,  // the corner has a large radius
            fill: $(go.Brush, 'Linear', { 0: 'rgb(254, 201, 0)', 1: 'rgb(254, 162, 0)' }),
            stroke: null,
            portId: '',  // this Shape is the Node's port, not the whole Node
            cursor: 'pointer',
            strokeWidth: 0
          },
        ),
        $(go.TextBlock,
          {
            font: 'bold 11pt IranianSansRegular, bold IranianSansRegular, IranianSansRegular',
            editable: true  // editing the text automatically updates the model data
          },
          new go.Binding('text').makeTwoWay())
      );

    // define the Node template
    this.myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $(go.Shape, 'RoundedRectangle',
          {
            parameter1: 20,  // the corner has a large radius
            fill: $(go.Brush, 'Linear', { 0: 'rgb(254, 201, 0)', 1: 'rgb(254, 162, 0)' }),
            stroke: null,
            portId: '',  // this Shape is the Node's port, not the whole Node
            cursor: 'pointer',
            strokeWidth: 0
          },
          new go.Binding('fill', 'color'),
        ),
        $(go.Panel, 'Table',
          { defaultAlignment: go.Spot.Left, margin: 4 },
          $(go.TextBlock,
            { row: 0, column: 100, columnSpan: 3, alignment: go.Spot.Center },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'key')),
          $(go.TextBlock, '-',
            { row: 0, column: 90 }),
          $(go.TextBlock, '',
            { row: 0, column: 80 }),
          $(go.TextBlock,
            { row: 0, column: 0 },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text')),
          $(go.TextBlock,
            { row: 1, alignment: go.Spot.Right },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'pendingDescription')),
          $(go.TextBlock,
            new go.Binding('visible', 'doneNumber', function (s) {
              if (s === 0) {
                return false;
              } else {
                return true;
              }
            }),
            { row: 2, alignment: go.Spot.Right },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'doneDescription')),
          $(go.TextBlock,
            new go.Binding('visible', 'stopNumber', function (s) {
              if (s === 0) {
                return false;
              } else {
                return true;
              }
            }),
            { row: 3, alignment: go.Spot.Right },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'stopDescription')),
        )
      );

    this.myDiagram.nodeTemplate.selectionAdornmentTemplate =
      $(go.Adornment, 'Spot',
        $(go.Panel, 'Auto',
          $(go.Shape, { fill: null, stroke: 'blue', strokeWidth: 2 }),
          $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
        ),
        // the button to create a 'next' node, at the top-right corner
      ); // end Adornment

    this.myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          curve: go.Link.Bezier, adjusting: go.Link.Stretch,
          reshapable: true, relinkableFrom: true, relinkableTo: true,
          toShortLength: 3
        },
        new go.Binding('points').makeTwoWay(),
        new go.Binding('curviness'),
        $(go.Shape,  // the link shape
          { strokeWidth: 1.5 }),
        $(go.Shape,  // the arrowhead
          { toArrow: 'standard', stroke: null }),
        $(go.Panel, 'Auto',
          $(go.Shape,  // the label background, which becomes transparent around the edges
            {
              fill: $(go.Brush, 'Radial',
                { 0: 'rgb(240, 240, 240)', 0.3: 'rgb(240, 240, 240)', 1: 'rgba(240, 240, 240, 0)' }),
              stroke: null
            }),
          $(go.TextBlock, '',  // the label text
            {
              textAlign: 'center',
              font: 'bold 11pt IranianSansRegular, bold IranianSansRegular, IranianSansRegular',
              margin: 4,
              editable: true  // enable in-place editing
            },
            // editing the text automatically updates the model data
            new go.Binding('text').makeTwoWay())
        )
      );
    // read in the JSON data from the 'mySavedModel' element
    this.myDiagram.allowTextEdit = false;
    this.myDiagram.allowDelete = false;

    this.myDiagram.addDiagramListener('ObjectDoubleClicked', this.openDetailDialog.bind(this));
    this.myDiagram.zoomToFit();
    if (!this.workFlow.Graph) {
      this.workFlow.Graph = new GraphModel();
    }
    this.workFlow.Graph.class = 'go.GraphLinksModel';
    this.workFlow.Graph.nodeKeyProperty = 'key';
    this.myDiagram.model = new go.Model();
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.Graph));
  }
  //#endregion

  public openDetailDialog(e) {
    this.selectedNode = e.subject.part.data;
    if (this.selectedNode.pendingNumber === 0 && this.selectedNode.doneNumber === 0) {
      this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'برای این تسک هیچ گزارشی وجود ندارد', });
      return;
    }

    const dialogRef = this.dialog.open(WorkflowListDialogComponent, {
      data: { node: this.selectedNode, workflowId: this.data.WorkflowId },
      width: '80%',
      maxHeight: '70vh',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          this.showWorkflowDetail.emit(res);
        }
      }
    );
  }
}
