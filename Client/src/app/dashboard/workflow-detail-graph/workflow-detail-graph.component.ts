import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { LogService } from '../../services/log.service';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { WorkFlowModel } from '../../model/workflow.model';
import { DatePipe } from '@angular/common';
import { PersianNumberPipe } from '../../pipes/persian-number.pipe';
import * as go from 'gojs';
import { GraphModel } from '../../model/graph.model';


@Component({
  selector: 'app-workflow-detail-graph',
  templateUrl: './workflow-detail-graph.component.html',
  styleUrls: ['./workflow-detail-graph.component.css'],
  providers: [DatePipe]
})
export class WorkflowDetailGraphComponent implements OnInit {

  @Input() data: string;
  @ViewChild('myDiagramDivDetail') element: ElementRef;

  public workflowDetail: WorkFlowModel = new WorkFlowModel();
  public persianNumberPipe: PersianNumberPipe = new PersianNumberPipe();
  public myDiagram: go.Diagram;

  constructor(
    private service: LogService,
    private loading: LoadingService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getWorkflowDetail();
  }

  getWorkflowDetail() {
    this.loading.start();
    this.service.getWorkflowDetail(this.data).subscribe(
      (res: WorkFlowModel) => {
        this.workflowDetail = res;
        this.convertFields();
      },
      () => {
        this.loading.stop();
      }, () => this.loading.stop()
    );
  }

  convertFields() {
    this.workflowDetail.graph.nodeDataArray.forEach(element => {
      if (element.startDate) {
        element.startDateDescription = ' شروع در ' + this.persianNumberPipe.transform(element.startDate);
      }
      if (element.endDate) {
        element.endDateDescription = ' پایان در ' + this.persianNumberPipe.transform(element.endDate);
      }
      if (element.deadLine) {
        element.deadLineDescription = 'مهلت انجام کار' + this.persianNumberPipe.transform(element.deadLine) + ' دقیقه است .';
      }

    });

    this.workflowDetail.graph.nodeDataArray.forEach(element => {
      switch (element.status) {
        case 'Success':
          element.color = '#24E83E';
          break;
        case 'Warning':
          element.color = '#EEEE19';
          break;
        case 'Danger':
          element.color = '#fb5a5a';
          break;
        case 'OverDue':
          element.color = '#FF0000';
          break;
        case 'None':
          element.color = '#00fefe';
          break;
        default:
          element.color = '#8FBC8F';
          break;
      }
    });
    this.graphInitializer();
    this.loading.stop();
  }

  //#region graphInitializer
  public graphInitializer() {
    const $ = go.GraphObject.make;
    this.myDiagram =
      $(go.Diagram, this.element.nativeElement,  // must name or refer to the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
          layout: $(go.LayeredDigraphLayout,
            {
              columnSpacing: 5,
              setsPortSpots: false,
              direction: 90,
              layerSpacing: 60
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
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left
        },
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
          { defaultAlignment: go.Spot.Right, margin: 4 },
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
            new go.Binding('visible', 'StartDateDescription', function (s) {
              if (s) {
                return true;
              } else {
                return false;
              }
            }),
            { row: 2, alignment: go.Spot.Right },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'StartDateDescription')),
          $(go.TextBlock,
            new go.Binding('visible', 'EndDateDescription', function (s) {
              if (s) {
                return true;
              } else {
                return false;
              }
            }),
            { row: 3, alignment: go.Spot.Right },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'EndDateDescription')),
          $(go.TextBlock,
            new go.Binding('visible', 'DeadLineDescription', function (s) {
              if (s) {
                return true;
              } else {
                return false;
              }
            }),
            { row: 1, alignment: go.Spot.Right },
            { font: 'bold 12pt IranianSansRegular' }, new go.Binding('text', 'DeadLineDescription')),
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

    if (!this.workflowDetail.graph) {
      this.workflowDetail.graph = new GraphModel();
    }
    this.workflowDetail.graph.class = 'go.GraphLinksModel';
    this.workflowDetail.graph.nodeKeyProperty = 'key';
    this.myDiagram.model = new go.Model();
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workflowDetail.graph));
  }
  //#endregion
}
