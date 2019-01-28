import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LogModel } from '../../model/log.model';
import * as go from 'gojs';
import { WorkFlowModel } from '../../model/workflow.model';
import { GraphModel } from '../../model/graph.model';
import { WorkflowService } from '../../services/workflow.service';
import { Message } from 'primeng/components/common/api';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-graph-log',
  templateUrl: './graph-log.component.html',
  styleUrls: ['./graph-log.component.css']
})
export class GraphLogComponent implements OnInit {

  @ViewChild('myDiagramDiv') element: ElementRef;
  public myDiagram: go.Diagram;
  public workFlow: WorkFlowModel = new WorkFlowModel();
  public errorMessages: Message[] = [];
  public isLoading: boolean;
  public workflowLogs: LogModel[] = [];

  constructor(
    private dialogRef: MatDialogRef<GraphLogComponent>,
    private workflowService: WorkflowService,
    private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: LogModel
  ) { }

  ngOnInit() {
    this.getWorkflow();
  }

  getWorkflow() {
    this.isLoading = true;
    this.workflowService.getWorkFlow(this.data.WorkflowId, this.data.WorkflowVersion).subscribe(
      (res: WorkFlowModel) => {
        this.isLoading = false;
        this.workFlow = res;
        this.getWorkflowLogByUniqKey();
      }, (error) => {
        this.showErrorMessage('خطا در گرفتن گراف' + error);
        this.isLoading = false;
      }
    );
  }

  getWorkflowLogByUniqKey() {
    this.logService.getWorkflowLogByUniqKey(this.data.UniqKey).subscribe(
      (res: LogModel[]) => {
        this.workflowLogs = res;
        this.setNodeColors();
      }, (error) => {
        this.showErrorMessage('خطا در گرفتن گزارش' + error);
      }
    );
  }

  setNodeColors() {
    this.workFlow.graph.nodeDataArray.forEach(element => {
      element.color = 'lightgray';
    });

    const currentTask = this.workflowLogs.find(x => x.TaskId === this.workflowLogs[0].CurrentTaskId);

    if (!this.data.isFinishedWorkflow) {
      this.workFlow.graph.nodeDataArray.find(x => x.key === currentTask.TaskIndex).color = 'lightblue';
    } else {
      this.workFlow.graph.nodeDataArray.find(x => x.key === currentTask.TaskIndex).color = 'lightgray';
    }

    this.workflowLogs.forEach(element => {
      if (
        element.TaskId !== 0 &&
        element.Id !== element.CurrentTaskId &&
        element.TaskIndex !== 0 &&
        element.TaskIndex !== currentTask.TaskIndex) {
        this.workFlow.graph.nodeDataArray.find(x => x.key === element.TaskIndex).color = 'lightgreen';
      }
    });
    this.graphInitializer();
  }

  public graphInitializer() {
    const $ = go.GraphObject.make;
    this.myDiagram =
      $(go.Diagram, this.element.nativeElement,  // must name or refer to the DIV HTML element
        {
          // start everything in the middle of the
          initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
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
        )
      );

    // unlike the normal selection Adornment, this one includes a Button
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

    if (!this.workFlow.graph) {
      this.workFlow.graph = new GraphModel();
    }
    this.workFlow.graph.class = 'go.GraphLinksModel';
    this.workFlow.graph.nodeKeyProperty = 'key';
    this.myDiagram.model = new go.Model();
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.graph));
  }

  public showErrorMessage(messages: string) {
    this.errorMessages = [];
    this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: messages });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
