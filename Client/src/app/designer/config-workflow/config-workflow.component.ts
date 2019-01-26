import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkFlowModel } from '../../model/workflow.model';
import { LunchTypeModel } from '../../model/lunch-type.model';
import { TaskModel } from '../../model/task.model';
import { MatDialog, MatSidenav } from '@angular/material';
import { Message } from 'primeng/components/common/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { EmployModel } from '../../model/employ.model';
import { TaskNameModel } from '../../model/task-name.model';
import { IdVersionModel } from '../../model/id-version.model';
import { VersionConfirmDialogComponent } from '../version-confirm.dialog/version-confirm.dialog.component';
import { RoleModel } from '../../model/role.model';
import { SettingLogicService } from '../../logic/setting-logic.service';
import { TaskLogicService } from '../../logic/task-logic.service';
import { WorkflowSaveValidationService } from '../../validation/workflow-save-validation.service';
import { EmployeLogicService } from '../../logic/employe-logic.service';
import { GraphLogicService } from '../../logic/graph-logic.service';
import * as go from 'gojs';
import { GraphModel, NodeDataArrayModel, LinkDataArrayModel } from '../../model/graph.model';
import { GraphValidationService } from '../../validation/graph-validation.service';
import { TaskValidationService } from '../../validation/task-validation.service';
import { TaskTypeModel } from '../../model/task-type.model';
import { WhileModel } from '../../model/while.model';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { VersionConfirmModel } from '../../model/version-confirm.model';
import { SettingModel } from '../../model/setting.model';
import { ShowRulesDialogComponent } from '../show-rules.dialog/show-rules.dialog.component';
import { debug } from 'util';

@Component({
  selector: 'app-config-workflow',
  templateUrl: './config-workflow.component.html',
  styleUrls: ['./config-workflow.component.css'],
  providers: [MessageService]
})
export class ConfigWorkflowComponent implements OnInit, AfterViewInit {

  @ViewChild('myDiagramDiv') element: ElementRef;
  @ViewChild('sidenav') sidenav: MatSidenav;

  public selectedEmploys: string[] = [];
  public selectedRoles: string[] = [];
  public e: any;
  public obj: any;
  public workFlowId: number;
  public workFlowVersion: number;
  public workFlow: WorkFlowModel = new WorkFlowModel();
  public originalWorkFlow: WorkFlowModel = new WorkFlowModel();
  public lunchTypes: LunchTypeModel[] = [];
  public taskNames: TaskNameModel[] = [];
  public taskNamesForJump: NodeDataArrayModel[] = [];
  public taskName: TaskNameModel = new TaskNameModel();
  public errorMessages: Message[] = [];
  public employs: SelectItem[] = [];
  public accessories: SelectItem[] = [];
  public roles: SelectItem[] = [];
  public newEmployList: string[];
  private filteredEmployes: string[] = [];
  private filteredRoles: string[] = [];
  public myDiagram: go.Diagram;
  public selectedTask: TaskModel = new TaskModel();
  public task: TaskModel = new TaskModel();
  public showSaveTaskPanel: boolean;
  public taskTypes: TaskTypeModel[] = [];
  public taskType: TaskTypeModel = new TaskTypeModel();
  public taskEditMode: boolean;
  public showLinkPanel: boolean;
  public linkTasks: NodeDataArrayModel[] = [];
  public linkTask: NodeDataArrayModel = new NodeDataArrayModel();
  public workflows: WorkFlowModel[] = [];
  public expandWorkflowConfig = true;
  cars: SelectItem[];

  constructor(
    private workflowService: WorkflowService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
    private settingLogicService: SettingLogicService,
    private taskLogicService: TaskLogicService,
    private workflowSaveValidationService: WorkflowSaveValidationService,
    private employeLogicService: EmployeLogicService,
    private graphLogicService: GraphLogicService,
    private graphValidationService: GraphValidationService,
    private taskValidationService: TaskValidationService,
    private loading: LoadingService) {
    this.route.params.subscribe((params: Params) => {
      this.workFlowId = +params['id'];
      this.workFlowVersion = +params['version'];
      this.cars = [
        { label: 'Audi', value: 'Audi' },
        { label: 'BMW', value: 'BMW' },
        { label: 'Fiat', value: 'Fiat' },
        { label: 'Ford', value: 'Ford' },
        { label: 'Honda', value: 'Honda' },
        { label: 'Jaguar', value: 'Jaguar' },
        { label: 'Mercedes', value: 'Mercedes' },
        { label: 'Renault', value: 'Renault' },
        { label: 'VW', value: 'VW' },
        { label: 'Volvo', value: 'Volvo' }
      ];
    });
  }

  ngOnInit() {
    this.getTaskTypes();
    this.getEmploys();
    this.getRoles();

    if (this.workFlowId) {
      this.getWorkflow();
    } else {
      this.getLunchTypes();
    }

    this.accessories.push({ value: '2', label: 'پین پد' });
    this.accessories.push({ value: '1', label: 'مودم' });
    this.accessories.push({ value: '3', label: 'صندوق فروشگاهی' });
  }

  ngAfterViewInit() {
    this.graphInitializer();
  }

  getEmploys() {
    this.employs = [];
    this.workflowService.getEmploys().subscribe(
      (res: any) => {
        if (res) {
          if (res.length > 0) {
            res.forEach(element => {
              this.employs.push({
                label: this.employeLogicService.getEmploysFullName(element),
                value: element.Id
              });
            });
          }
        }
      },
      (error: any) => { }
    );
  }

  getRoles() {
    this.roles = [];
    this.workflowService.getRoles().subscribe(
      (res: any) => {
        if (res) {
          if (res.length > 0) {
            res.forEach(element => {
              this.roles.push({
                value: element.ID,
                label: element.Title
              });
            });
          }
        }
      },
      (error: any) => { }
    );
  }

  filterEmployMultiple(event, selectedUsers: string[]) {
    this.filteredEmployes = this.filterEmployes(event.query, this.employs);
    for (const item of selectedUsers) {
      if (this.filteredEmployes.find(x => x === item)) {
        const index = this.filteredEmployes.indexOf(this.filteredEmployes.find(x => x === item));
        this.filteredEmployes.splice(index, 1);
      }
    }
  }

  changeTaskInList() {
    this.task.PersianName = this.taskName.PersianName;
    this.task.Name = this.taskName.Name;
    this.task.isIf = this.taskName.Type === 'if';
    this.task.IsCommon = this.taskName.Type === 'commonTask';
    if (this.task.Name === 'JumpTo') {
      this.taskNamesForJump = this.workFlow.Graph.nodeDataArray.filter(x => x.key !== this.task.key);
      this.taskNamesForJump = this.taskNamesForJump.filter(x => x.text !== 'شروع مجدد از تسک مشخص شده');
    }
    if (this.task.Name === 'StartWorkflow') {
      this.getWorkflows();
    }

    this.workflowService.getSettingNames(this.task.Name).subscribe(
      (res: string[]) => {
        this.task.Settings = [];
        for (let i = 0; i < res.length; i++) {
          this.task.Settings.push({
            Name: res[i],
            Value: res[i] === 'type' ? this.taskNames.find(x => x.Name === this.task.Name).Type : '',
            Attributes: res,
            isNewSetting: true,
            Roles: [],
            Users: []
          });
        }
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: error, });
      }
    );
  }

  getWorkflows() {
    this.loading.start();
    this.workflows = [];
    this.workflowService.getWorkFlows().subscribe(
      (res: WorkFlowModel[]) => {
        this.workflows = this.workFlowId ?
          res.filter(x => x.Id !== this.workFlowId) :
          res;
        this.loading.stop();
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'خطا در گرفتن لیست فرایند ها', });
        this.loading.stop();
      }
    );
  }

  filterRoleMultiple(event, selectedRoles: string[] = []) {
    this.filteredRoles = this.filterRoles(event.query, this.roles);
    for (const item of selectedRoles) {
      if (this.filteredRoles.find(x => x === item)) {
        const index = this.filteredRoles.indexOf(this.filteredRoles.find(x => x === item));
        this.filteredRoles.splice(index, 1);
      }
    }
  }

  filterRoles(query, roles: any[]): any[] {
    const filtered: any[] = [];
    for (let i = 0; i < roles.length; i++) {
      const role: RoleModel = roles[i];
      if (role.Title.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(role.Title);
      }
    }
    return filtered;
  }

  filterEmployes(query, employes: any[]): any[] {
    const filtered: any[] = [];
    for (let i = 0; i < employes.length; i++) {
      const employ = employes[i];
      if (employ.FullName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(employ.FullName);
      }
    }
    return filtered;
  }

  // onSelectEmploy(emp: any) {
  //   const tempList = [];
  //   for (let i = 0; i < emp.length; i++) {
  //     tempList.push(this.employs.find(x => x.FullName === emp[i]).Id);
  //   }
  //   this.task.Settings.find(x => x.Name === 'کاربر').Value = JSON.stringify(tempList);
  // }

  // onSelectRole(role: any) {
  //   const tempList = [];
  //   for (let i = 0; i < role.length; i++) {
  //     tempList.push(this.roles.find(x => x.Title === role[i]).ID);
  //   }
  //   this.task.Settings.find(x => x.Name === 'گروه کاربری').Value = JSON.stringify(tempList);
  // }

  refreshPage() {
  }

  public graphInitializer() {
    const $ = go.GraphObject.make;
    this.myDiagram =
      $(go.Diagram, this.element.nativeElement,
        {
          initialDocumentSpot: go.Spot.TopCenter,
          initialViewportSpot: go.Spot.TopCenter,
          initialAutoScale: go.Diagram.Uniform
        },
        // must name or refer to the DIV HTML element
        {
          // start everything in the middle of the
          layout: $(go.LayeredDigraphLayout,
            {
              columnSpacing: 5,
              setsPortSpots: false,
              direction: 90,
              layerSpacing: 20,
            }), initialContentAlignment: go.Spot.Center,
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
            editable: true
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
            { row: 1, column: 0, alignment: go.Spot.Right },
            { font: '10pt IranianSansRegular' }, new go.Binding('text', 'description')),
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
        $('Button',
          {
            alignment: go.Spot.TopLeft,
            click: this.openAddPanel.bind(this)  // this function is defined below
          },
          $(go.Shape, 'PlusLine', { width: 6, height: 6 })
        ), // end button
        $('Button',
          {
            alignment: go.Spot.BottomCenter,
            click: this.openLinkPanel.bind(this)  // this function is defined below
          },
          $(go.Shape, 'TriangleDown', { width: 6, height: 6 })
        ), // end button
        $('Button',
          {
            alignment: go.Spot.TopCenter,
            click: this.openEditPanel.bind(this)  // this function is defined below
          },
          $(go.Shape, 'AsteriskLine', { width: 6, height: 6 })
        ), // end button
        $('Button',
          {
            alignment: go.Spot.TopRight,
            click: this.deleteNode.bind(this)  // this function is defined below
          },
          $(go.Shape, 'XLine', { width: 6, height: 6 }),
        ) // end button
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

    this.myDiagram.zoomToFit();

    if (!this.workFlow.Graph) {
      this.workFlow.Graph = new GraphModel();
    }
    this.workFlow.Graph.class = 'go.GraphLinksModel';
    this.workFlow.Graph.nodeKeyProperty = 'key';
    this.myDiagram.model = new go.Model();

    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.Graph));
  }

  showUserSelector(settings: SettingModel[]) {
    if (settings.find(x => x.Name === 'getUserFromModel')) {
      if (settings.find(x => x.Name === 'getUserFromModel').Value.toString() === 'true' ||
        settings.find(x => x.Name === 'getUserFromModel').Value.toString() === 'True') {
        return false;
      }
    }
    return true;
  }

  deleteNode(e, obj) {
    const node: TaskModel = obj.part.adornedPart.data;
    this.workFlow.Graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.workFlow.Graph.nodeDataArray = JSON.parse(this.myDiagram.model.toJson()).nodeDataArray;
    this.workFlow.Graph.class = JSON.parse(this.myDiagram.model.toJson()).class;
    this.workFlow.Graph.nodeDataArray.splice(this.workFlow.Graph.nodeDataArray.findIndex(x => x.key === node.key), 1);
    this.workFlow.Graph.linkDataArray = this.graphLogicService.removeLinksOfRemovedNode(this.workFlow, node);
    if (this.workFlow.Graph.whileGroups) {
      this.workFlow.Graph.whileGroups = this.graphLogicService.removeWhileFromWhileGroup(this.workFlow, node);
    }
    this.workFlow.Tasks = this.taskLogicService.removeTaskFromTaskList(this.workFlow.Tasks, node.taskId);
    this.workFlow.NewVersion = true;
    this.workFlow.isGraphEdited = true;

    if (this.workFlow.Graph.nodeDataArray.find(x => x.doNodeId === node.key)) {
      this.workFlow.Graph.nodeDataArray.find(x => x.doNodeId === node.key).doNodeId = null;
    }

    if (this.workFlow.Graph.nodeDataArray.find(x => x.elseNodeId === node.key)) {
      this.workFlow.Graph.nodeDataArray.find(x => x.elseNodeId === node.key).elseNodeId = null;
    }

    this.myDiagram.model = go.Model.fromJson(this.workFlow.Graph);
  }

  openEditPanel(e, obj) {
    this.obj = obj;
    this.e = e;
    this.task = new TaskModel();
    this.showSaveTaskPanel = true;
    this.task = JSON.parse(JSON.stringify(obj.part.adornedPart.data));
    this.task.Description = obj.part.adornedPart.data.description;
    this.task.PersianName = this.task.text;
    this.task.Name = this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Name;
    this.task.Settings = JSON.parse(JSON.stringify(this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings));
    const linkToTask =
      this.workFlow.Graph.linkDataArray.find(x => x.to === this.task.key) ?
        this.workFlow.Graph.linkDataArray.find(x => x.to === this.task.key) :
        new LinkDataArrayModel();
    const parent = this.workFlow.Graph.nodeDataArray.find(x => x.key === linkToTask.from);
    this.task.parentTask = new TaskModel();
    this.task.parentTask.text = parent ? parent.text : '';

    this.taskEditMode = true;

    if (this.task.isIf) {
      this.taskType = this.taskTypes.find(x => x.name === 'if');
    } else if (this.task.isWhile) {
      this.taskType = this.taskTypes.find(x => x.name === 'while');
    } else if (this.task.IsCommon) {
      this.taskType = this.taskTypes.find(x => x.name === 'commonTask');
    } else if (this.task.isSwitch) {
      this.taskType = this.taskTypes.find(x => x.name === 'switch');
    } else {
      this.taskType = this.taskTypes.find(x => x.name === 'task');
    }
    this.changeTaskTypeInList();
    // this.taskName = this.taskNames.find(x => x.Name === this.task.Name);

    if (this.task.Settings.find(x => x.Name === 'کاربر')) {
      if (this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'کاربر').Value === '') {
        this.task.Settings.find(x => x.Name === 'کاربر').Value = [];
      }
      if (typeof this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'کاربر').Value === 'string') {
        if (this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'کاربر').Value === '') {
          this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'کاربر').Value = '[]';
        }
        this.task.Settings.find(x => x.Name === 'کاربر').Value
          = JSON.parse(this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'کاربر').Value);
      }
    }
    if (this.task.Settings.find(x => x.Name === 'گروه کاربری')) {
      if (this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'گروه کاربری').Value === '') {
        this.task.Settings.find(x => x.Name === 'گروه کاربری').Value = [];
      }
      if (typeof this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'گروه کاربری').Value === 'string') {
        if (this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'گروه کاربری').Value === '') {
          this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'گروه کاربری').Value = '[]';
        }
        this.task.Settings.find(x => x.Name === 'گروه کاربری').Value
          = JSON.parse(this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings.find(x => x.Name === 'گروه کاربری').Value);
      }
    }

    if (this.task.Name === 'JumpTo') {
      const nodes = this.workFlow.Graph.nodeDataArray.filter(x => x.key !== this.task.key);
      this.taskNamesForJump = nodes.filter(x => x.text !== 'شروع مجدد از تسک مشخص شده');
      this.loading.stop();
    }
    if (this.task.Name === 'StartWorkflow') {
      this.getWorkflows();
    }
    this.sidenav.open();
  }

  showAddTaskButton() {
    if (this.taskEditMode) {
      return false;
    }
    if (this.showLinkPanel) {
      return false;
    }
    return true;
  }

  openLinkPanel(e, obj) {
    this.obj = obj;
    this.e = e;
    this.linkTasks = [];
    this.task.parentTask = obj.part.adornedPart.data;
    this.task.parentTask.PersianName = this.task.parentTask.text;
    this.task.parentTask.Name = this.workFlow.Tasks.find(x => x.Id === this.task.parentTask.taskId).Name;

    // if (this.task.isIf) {
    //   this.task.parentTask = new TaskModel();
    //   this.task.parentTask.isIf = true;
    // }

    const validation = this.graphValidationService.openLinkPanelValidation(this.workFlow.Graph, this.task);
    if (validation.success === false) {
      this.showErrorMessage(validation.messages);
      return;
    }
    this.linkTasks = this.workFlow.Graph.nodeDataArray.filter(x => x.key !== this.task.key);
    this.showLinkPanel = true;
    // this.taskEditMode = true;
    this.sidenav.open();
  }

  saveLink() {
    const validation = this.graphValidationService.saveLink(this.workFlow.Graph, this.task, this.linkTask);
    if (validation.success === false) {
      this.showErrorMessage(validation.messages);
      return;
    }

    const link = new LinkDataArrayModel();
    link.from = this.task.parentTask.key;
    link.to = this.linkTask.key;
    if (this.task.parentTask.isIf) {
      link.text = this.task.ifResult ? 'بله' : 'خیر';

      const task = this.workFlow.Graph.nodeDataArray.find(x => x.key === this.task.parentTask.key);
      if (this.task.ifResult === true) {
        task.doNodeId = this.linkTask.key;
      } else if (this.task.ifResult === false) {
        task.elseNodeId = this.linkTask.key;
      }
    }

    if (this.workFlow.Graph.nodeDataArray.find(x => x.key === link.to).isRoot) {
      this.workFlow.Graph.nodeDataArray.find(x => x.key === link.to).isRoot = false;
      this.workFlow.Graph.nodeDataArray.find(x => x.key === link.from).isRoot = true;
    }

    this.workFlow.Graph.linkDataArray.push(link);
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.Graph));
    this.cancelAddTask();
  }

  openAddPanel(e, obj) {
    this.task = new TaskModel();
    this.taskName = new TaskNameModel();
    this.task.parentTask = new TaskModel();
    this.taskType = new TaskTypeModel();
    this.taskEditMode = false;
    this.obj = obj;
    this.e = e;
    this.task.parentTask = obj.part.adornedPart.data;

    // TO SET isDefaultInSwitch FIELD
    this.task.isDefaultInSwitch = false;
    if (this.task.parentTask.isSwitch) {
      if (this.workFlow.Graph.linkDataArray) {
        this.workFlow.Graph.linkDataArray.filter(x => x.from === this.task.parentTask.key).forEach(element => {
          const switchChield = this.workFlow.Graph.nodeDataArray.find(x => x.key === element.to);
          if (switchChield.isDefault) {
            this.task.isDefaultInSwitch = true;
          }
        });
      }
    }

    if (this.task.parentTask.isSwitch) {
      this.task.isInSwitch = true;
    }
    const validation = this.graphValidationService.openAddPanelValidation(this.workFlow.Graph, this.task, this.workFlow.Graph.whileGroups);
    if (validation.success === false) {
      this.showErrorMessage(validation.messages);
      return;
    }
    this.sidenav.open();
  }

  public showErrorMessage(messages: string[]) {
    this.errorMessages = [];
    messages.forEach(element => {
      this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: element });
    });
  }

  saveWorkflow() {
    this.errorMessages = [];
    const workflowValidate = this.workflowSaveValidationService.validateWorkflowForSave(this.workFlow);
    if (workflowValidate.success === false) {
      this.showErrorMessage(workflowValidate.messages);
      return;
    }

    this.checkAndSetRoot();
    if (this.workFlow.IsNew) {
      this.saveNewWorkflow();
    } else {
      this.checkSaveExistWorkflow();
    }
  }

  checkAndSetRoot() {
    if (!this.workFlow.Graph.nodeDataArray.find(x => x.isRoot)) {
      this.workFlow.Graph.nodeDataArray.forEach(element => {
        if (!this.workFlow.Graph.linkDataArray.find(x => x.to === element.key)) {
          element.isRoot = true;
        }
      });
    }
  }

  // unselectEmploy(event: string, task: TaskModel) {
  //   const users = JSON.parse(task.Settings.find(x => x.Name === 'کاربر').Value);
  //   const user = this.employs.find(x => x.FullName === event).Id;
  //   const index = users.indexOf(user);
  //   users.splice(index, 1);
  //   this.task.Settings.find(x => x.Name === 'کاربر').Value = JSON.stringify(users);
  // }

  // unselectRole(event: string, task: TaskModel) {
  //   const roles = JSON.parse(task.Settings.find(x => x.Name === 'گروه کاربری').Value);
  //   const role = this.roles.find(x => x.Title === event).ID;
  //   const index = roles.indexOf(role);
  //   roles.splice(index, 1);
  //   this.task.Settings.find(x => x.Name === 'گروه کاربری').Value = JSON.stringify(roles);
  // }

  showRules(setting: SettingModel) {
    if (!this.workFlowId) {
      this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'برای این فرایند هنوز هیچ شناسه ای ثبت نشده است', });
      return;
    }
    setting.workflowId = this.workFlowId;
    const dialogRef = this.dialog.open(ShowRulesDialogComponent, {
      disableClose: true,
      data: setting,
      width: '70%',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        setting = res;
      }
    });
  }

  public checkSaveExistWorkflow() {
    this.workFlow = this.workflowSaveValidationService.checkForNeedNewVersion(
      this.workFlow,
      this.originalWorkFlow);

    if (this.workFlow.NewVersion) {
      const dialogRef = this.dialog.open(VersionConfirmDialogComponent, {
        data: this.workFlow.versionChangeList,
        width: '50%',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res: VersionConfirmModel) => {
        if (res.success) {
          this.workFlow.VersionDescription = res.message;
          this.saveExistWorkFlow();
        }
      });
    } else {
      this.saveExistWorkFlow();
    }
  }

  saveExistWorkFlow() {
    // this.workFlow.Graph.nodeDataArray = JSON.parse(this.myDiagram.model.toJson()).nodeDataArray;
    // this.workFlow.Graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.errorMessages = [];
    this.properLinks();
    const req = JSON.stringify(this.workFlow);
    this.workflowService.saveWorkflow(this.workFlow).subscribe(
      (res: any) => {
        if (res === false) {
          this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'اشکال سیستمی وجود دارد', });
          return;
        }
        this.errorMessages.push({ severity: 'success', summary: 'پیغام موفق', detail: 'فرایند با موفقیت ذخیره شد', });
        this.router.navigate(['../../designer/config/' + res.Id + '/' + res.Version]);
        this.workFlowVersion = res.Version;
        this.getWorkflow();
      }, (error: any) => {

      }
    );
  }

  properLinks() {
    const linkDataArray = this.workFlow.Graph.linkDataArray;
    const nodeDataArray = this.workFlow.Graph.nodeDataArray;
    if (!this.workFlow.Graph.linkDataArray) {
      return;
    }
    while (linkDataArray.filter(x => x.from > x.to).length > 0) {
      const targetLink = linkDataArray.filter(x => x.from > x.to)[0];
      if (targetLink) {
        const originalTo = JSON.parse(JSON.stringify(targetLink.to));
        let from = JSON.parse(JSON.stringify(targetLink.from));
        while (nodeDataArray.find(x => x.key === from)) {
          from++;
        }
        // TO SET NODE KEYS
        // const nodeToChange = nodeDataArray.find(x => x.key === targetLink.to);
        // if (nodeToChange.text === 'شروع مجدد از تسک مشخص شده') {
        //   const task = this.workFlow.Tasks.find(x => x.Id === nodeToChange.taskId);
        //   task.Settings.find(x => x.Value === targetLink.to).Value = from;
        // }
        this.workFlow.Tasks.forEach(element => {
          if (element.Name === 'JumpTo') {
            if (element.Settings.find(x => x.Value === targetLink.to.toString())) {
              element.Settings.find(x => x.Value === targetLink.to.toString()).Value = from;
            }
          }
        });
        nodeDataArray.find(x => x.key === targetLink.to).key = from;

        // TO SET FROM LINKS
        linkDataArray.filter(x => x.from === targetLink.to).forEach(element => {
          element.from = from;
        });

        // TO SET TO LINKS
        linkDataArray.filter(x => x.to === targetLink.to).forEach(element => {
          element.to = from;
        });

        // TO SET IF DO NODE IDs
        nodeDataArray.filter(x => x.isIf).forEach(element => {
          if (element.doNodeId === originalTo) {
            element.doNodeId = from;
          }
          if (element.elseNodeId === originalTo) {
            element.elseNodeId = from;
          }
        });
      }
    }
  }

  saveNewWorkflow() {
    this.workFlow.Graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.errorMessages = [];
    this.workFlow.Path += this.workFlow.Name;
    this.workFlow.IsNew = true;
    this.properLinks();
    this.workflowService.saveWorkflow(this.workFlow).subscribe(
      (res: IdVersionModel) => {
        if (res) {
          this.errorMessages.push({ severity: 'success', summary: 'پیغام موفق', detail: 'فرایند با موفقیت ذخیره شد', });
          this.router.navigate(['../../designer/config/' + res.Id + '/' + 0]);
          this.getWorkflow();
        } else {
          this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'اشکال سیستمی وجود دارد', });
        }

      }, (error: any) => {
      }
    );
  }

  addTask() {
    if (!this.workFlow.Graph.whileGroups) {
      this.workFlow.Graph.whileGroups = [];
    }
    const taskValidation = this.taskValidationService.addTaskValidation(this.task);
    if (taskValidation.success === false) {
      this.showErrorMessage(taskValidation.messages);
      return;
    }

    const graphValidation = this.graphValidationService.addNodeValidate(this.task);
    if (graphValidation.success === false) {
      this.showErrorMessage(graphValidation.messages);
      return;
    }

    if (this.task.parentTask.isInWhile || this.task.parentTask.isWhile) {
      if (this.task.parentTask.isWhile) {
        if (this.task.whileResult) {
          this.task.isInWhile = true;
        }
        if (this.task.parentTask.isInWhile) {
          this.task.isInWhile = true;
        }
      } else if (this.task.parentTask.isInWhile) {
        if (!this.task.parentTask.isIf && !this.task.parentTask.isSwitch) {
          this.task.isInWhile = true;
        }
        if (this.task.parentTask.isIf && this.task.ifResult === undefined) {
          this.task.isInWhile = true;
        }
        if (this.task.parentTask.isSwitch && this.task.goToWhile) {
          this.task.isInWhile = true;
          this.task.isInSwitch = false;
        }
      }
    }

    if (this.workFlow.Graph.nodeDataArray.length === 0) {
      this.task.isRoot = true;
    }

    this.task.Id = this.generateTaskId();
    this.task.key = this.generateNodeKey();
    if (this.task.Settings.find(x => x.Name === 'کاربر')) {
      if (this.task.Settings.find(x => x.Name === 'کاربر').Value === '') {
        this.task.Settings.find(x => x.Name === 'کاربر').Value = '[]';
      } else {
        this.task.Settings.find(x => x.Name === 'کاربر').Value = JSON.stringify(this.task.Settings.find(x => x.Name === 'کاربر').Value);
      }
    }
    if (this.task.Settings.find(x => x.Name === 'گروه کاربری')) {
      if (this.task.Settings.find(x => x.Name === 'گروه کاربری').Value === '') {
        this.task.Settings.find(x => x.Name === 'گروه کاربری').Value = '[]';
      } else {
        this.task.Settings.find(x => x.Name === 'گروه کاربری').Value =
          JSON.stringify(this.task.Settings.find(x => x.Name === 'گروه کاربری').Value);
      }
    }
    this.workFlow.Tasks.push(this.task);

    this.workFlow.Graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.workFlow.Graph.nodeDataArray = JSON.parse(this.myDiagram.model.toJson()).nodeDataArray;
    this.workFlow.Graph.class = JSON.parse(this.myDiagram.model.toJson()).class;

    if (this.task.isInSwitch) {
      if (this.task.isDefault) {
        this.workFlow.Graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text: 'پیش فرض'
        });
      } else if (this.task.parentTask.text === 'تسک چند شرطی کاربر ایجاد کننده') {
        const emp = this.employs.find(x => x.value === this.task.caseValue);
        this.workFlow.Graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text: emp.label
        });
      } else if (this.task.parentTask.text === 'تسک چند شرطی داینامیک') {
        this.workFlow.Graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text:
            this.task.caseLinkValue ?
              this.task.caseLinkValue :
              '',
        });
      }
    } else {
      if (this.task.parentTask.key) {
        this.workFlow.Graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text: this.determineLinkText()
        });
      }
    }

    if (this.task.parentTask) {
      if (this.task.parentTask.isIf) {
        const parent = this.workFlow.Graph.nodeDataArray.find(x => x.key === this.task.parentTask.key);
        if (this.task.ifResult === true) {
          parent.doNodeId = this.task.key;
        } else if (this.task.ifResult === false) {
          parent.elseNodeId = this.task.key;
        }
      }
    }

    if (this.task.parentTask) {
      if (this.task.parentTask.isWhile) {
        const parent = this.workFlow.Graph.nodeDataArray.find(x => x.key === this.task.parentTask.key);
        if (this.task.whileResult === true) {
          parent.doNodeId = this.task.key;
        } else if (this.task.whileResult === false) {
          parent.elseNodeId = this.task.key;
        }
      }
    }

    this.workFlow.Graph.nodeDataArray.push({
      key: this.task.key,
      text: this.task.PersianName,
      color: this.determineNodeColor(),
      Id: this.task.Id,
      isIf: this.task.isIf,
      isSwitch: this.task.isSwitch,
      isInSwitch: this.task.isInSwitch,
      isWhile: this.task.isWhile,
      IsCommon: this.task.IsCommon,
      description: this.task.Description,
      loc: this.task.parentTask ? this.task.parentTask.taskId ? this.setLocation() : '' : '',
      taskId: this.task.Id,
      isInWhile: this.task.isInWhile ? true : false,
      caseValue: this.task.caseValue,
      isRoot: this.task.isRoot,
      isDefault: this.task.isDefault,
    });

    this.myDiagram.model = go.Model.fromJson(this.workFlow.Graph);
    console.log(this.task);
    this.cancelAddTask();
  }

  determineLinkText(): string {
    if (this.task.parentTask.isIf) {
      if (this.task.ifResult === undefined) {
        return '';
      } else if (this.task.ifResult === true) {
        return 'بله';
      } else if (this.task.ifResult === false) {
        return 'خیر';
      }
    }
    return '';
  }

  determineNodeColor(): string {
    if (this.task.isWhile) {
      return 'yellow';
    }
    if (this.task.isIf) {
      return 'lightgreen';
    }
    if (this.task.isSwitch) {
      return 'pink';
    }
    return 'lightblue';
  }

  setLocation() {
    const fromNode = this.obj.part.adornedPart;
    const position = fromNode.location.copy();
    position.y += 100;
    return go.Point.stringify(position);
  }

  getTaskTypes() {
    this.taskTypes = [];
    this.taskTypes = this.workflowService.getTaskTypes();
  }

  generateNodeKey() {
    if (!this.workFlow.Graph.nodeDataArray) {
      this.workFlow.Graph.nodeDataArray = [];
    }
    if (this.workFlow.Graph.nodeDataArray.length === 0) {
      return 1;
    }
    const nodeKeys: number[] = [];
    this.workFlow.Graph.nodeDataArray.forEach(element => {
      nodeKeys.push(element.key);
    });
    return Math.max(...nodeKeys) + 1;
  }

  public generateTaskId() {
    if (this.workFlow.Tasks.length > 0) {
      return Math.max(...this.workFlow.Tasks.map(x => x.Id)) + 1;
    } else {
      return 1;
    }
  }

  newTask() {
    this.sidenav.open();
    this.task = new TaskModel();
    this.task.parentTask = new TaskModel();
    this.taskEditMode = false;
  }

  saveTask() {
    const taskValidation = this.taskValidationService.editTaskValidation(this.task);
    if (taskValidation.success === false) {
      this.showErrorMessage(taskValidation.messages);
      return;
    }

    const graphValidation = this.graphValidationService.editNodeValidate(this.task, this.workFlow.Graph);
    if (graphValidation.success === false) {
      this.showErrorMessage(graphValidation.messages);
      return;
    }

    const node = this.workFlow.Graph.nodeDataArray.find(x => x.key === this.task.key);
    node.text = this.task.PersianName;

    if (this.task.Settings.find(x => x.Name === 'کاربر')) {
      if (this.task.Settings.find(x => x.Name === 'کاربر').Value === '') {
        this.task.Settings.find(x => x.Name === 'کاربر').Value = '[]';
      } else {
        this.task.Settings.find(x => x.Name === 'کاربر').Value = JSON.stringify(this.task.Settings.find(x => x.Name === 'کاربر').Value);
      }
    }
    if (this.task.Settings.find(x => x.Name === 'گروه کاربری')) {
      if (this.task.Settings.find(x => x.Name === 'گروه کاربری').Value === '') {
        this.task.Settings.find(x => x.Name === 'گروه کاربری').Value = '[]';
      } else {
        this.task.Settings.find(x => x.Name === 'گروه کاربری').Value =
          JSON.stringify(this.task.Settings.find(x => x.Name === 'گروه کاربری').Value);
      }
    }

    if (this.task.caseValue) {
      node.caseValue = this.task.caseValue;
    }

    let task = this.workFlow.Tasks.find(x => x.Id === this.task.taskId);
    task = this.task;
    task.description = this.task.Description;
    this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Name = this.task.Name;
    this.workFlow.Tasks.find(x => x.Id === this.task.taskId).PersianName = this.task.PersianName;
    this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Description = this.task.Description;
    this.workFlow.Tasks.find(x => x.Id === this.task.taskId).Settings = this.task.Settings;
    this.workFlow.Graph.nodeDataArray.find(x => x.key === this.task.key).description = this.task.Description;
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.Graph));
    this.cancelAddTask();
  }

  cancelAddTask() {
    this.task = new TaskModel();
    this.task.parentTask = new TaskModel();
    this.taskEditMode = false;
    this.showSaveTaskPanel = false;
    this.taskType = new TaskTypeModel();
    this.taskName = new TaskNameModel();
    this.taskNames = [];
    this.linkTask = new NodeDataArrayModel();
    this.linkTasks = [];
    this.showLinkPanel = false;
    this.sidenav.close();
  }

  public getWorkflow() {
    this.workFlow.Graph.nodeDataArray = [];
    this.workFlow.Graph.linkDataArray = [];
    this.workFlow.Graph.whileGroups = [];

    this.loading.start();
    this.workFlow = new WorkFlowModel();
    this.workflowService.getWorkFlow(this.workFlowId, this.workFlowVersion).subscribe(
      (res: WorkFlowModel) => {
        this.workFlow = res;
        if (this.workFlow) {
          this.workFlow.NewVersion = false;
        }
        this.workFlow.IsNew = false;
        this.originalWorkFlow = JSON.parse(JSON.stringify(this.workFlow));
        if (this.workFlow.Graph) {
          this.workFlow.Graph = this.workFlow.Graph;
        }
        this.getLunchTypes();
        // this.fillTaskAutoComplete();
        // this.fillRoleAutocomplete();
        this.myDiagram.model = go.Model.fromJson(this.workFlow.Graph);
        this.loading.stop();
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: error, });
      }
    );
  }

  public getLunchTypes() {
    this.lunchTypes = [];
    this.lunchTypes = this.workflowService.getLunchTypes();
  }

  changeTaskTypeInList() {
    this.loading.start();
    this.taskNames = [];
    this.workflowService.getTaskNames().subscribe(
      (res: TaskNameModel[]) => {
        this.taskNames = res.filter(x => x.Type === this.taskType.name);
        // TODO. HANDLE THIS ACTION IN SERVER SIDE
        this.workFlow.Tasks = this.taskLogicService.fillTaskPersianNames(this.workFlow, this.taskNames);
        if (this.showSaveTaskPanel) {
          this.taskName = this.taskNames.find(x => x.Name === this.task.Name);
        }
        // this.taskName = this.taskNames.find(x => x.Name === this.task.Name);

        this.task.isIf = this.taskType.name === 'if' ? true : false;
        this.task.IsCommon = this.taskType.name === 'commonTask' ? true : false;
        this.task.isWhile = this.taskType.name === 'while' ? true : false;
        this.task.isSwitch = this.taskType.name === 'switch' ? true : false;
        this.task.isTask = this.taskType.name === 'task' ? true : false;
        this.loading.stop();
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: error + 'خطا در گرفتن لیست کل کارها', });
        this.loading.stop();
      }, () => {
        this.loading.stop();
      }
    );
  }

  back() {
    this.router.navigate(['../../designer']);
  }
}
