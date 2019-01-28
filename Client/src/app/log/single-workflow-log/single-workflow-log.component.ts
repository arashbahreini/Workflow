import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { LogService } from '../../services/log.service';
import { WorkflowLogRequestModel } from '../../model/workflow-log-request.model';
import { LogModel } from '../../model/log.model';
import * as go from 'gojs';
import { WorkFlowModel } from '../../model/workflow.model';
import { GraphModel } from '../../model/graph.model';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'app-single-workflow-log',
  templateUrl: './single-workflow-log.component.html',
  styleUrls: ['./single-workflow-log.component.css'],
  providers: [WorkflowService]
})
export class SingleWorkflowLogComponent implements OnInit {
  @ViewChild('myDiagramDiv') element: ElementRef;
  public myDiagram: go.Diagram;
  public workflowLogRequest = new WorkflowLogRequestModel();
  public workflowLogs: LogModel = new LogModel();
  public workflowLogsForGraph: LogModel[] = [];
  public workFlow: WorkFlowModel = new WorkFlowModel();
  public isLoading: boolean;
  public errorMessage: string = null;
  public hasResult = true;
  constructor(
    private route: ActivatedRoute,
    private logService: LogService,
  ) {
    this.route.params.subscribe((params: Params) => {
      this.workflowLogRequest.typeId = +params['workflowId'];
      this.workflowLogRequest.RequestNumber = +params['requestId'];
    });

  }

  ngOnInit() {
    this.getLog();
  }

  getLog() {
    this.workflowLogs = new LogModel();
    this.errorMessage = null;
    this.logService.getSinglePageWorkflowLog(this.workflowLogRequest).subscribe(
      (res: any) => {
        if (res.ExceptionCode === -1) {
          this.hasResult = false;
          this.errorMessage = res.ExceptionMessage;
        }
        if (res.WorkflowInfo) {
          this.hasResult = true;
          this.workflowLogs = res;
          this.workFlow = res.WorkflowInfo;
          this.setNodeColors();
        }
      },
      () => { }
    );
  }

  setNodeColors() {
    if (this.hasResult) {
      this.workFlow.graph.nodeDataArray.forEach(element => {
        element.color = 'lightgray';
      });

      this.workFlow.graph.nodeDataArray.forEach(element => {
        if (this.workflowLogs.TraversedIndexes.find(x => x === element.key)) {
          element.color = 'lightgreen';
        }
      });

      if (this.workflowLogs.StockedIndex) {
        if (this.workFlow.graph.nodeDataArray.find(x => x.key === this.workflowLogs.StockedIndex)) {
          this.workFlow.graph.nodeDataArray.find(x => x.key === this.workflowLogs.StockedIndex).color = 'lightblue';
        }
      }
      if (this.workflowLogs.HasStockedIndexError) {
        if (this.workFlow.graph.nodeDataArray.find(x => x.key === this.workflowLogs.StockedIndex)) {
          this.workFlow.graph.nodeDataArray.find(x => x.key === this.workflowLogs.StockedIndex).color = 'red';
        }
      }
    }
    this.graphInitializer();
  }

  public graphInitializer() {
    const $ = go.GraphObject.make;
    this.myDiagram =
      $(go.Diagram, this.element.nativeElement,
        {
          initialDocumentSpot: go.Spot.TopCenter,
          initialViewportSpot: go.Spot.TopCenter,
          initialAutoScale: go.Diagram.Uniform
        }, // must name or refer to the DIV HTML element
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
            }),
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
    this.workFlow.graph.class = 'go.graphLinksModel';
    this.workFlow.graph.nodeKeyProperty = 'key';
    this.myDiagram.model = new go.Model();
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.graph));
  }
}
