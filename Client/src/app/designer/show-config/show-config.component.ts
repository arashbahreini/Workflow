import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorkFlowModel } from '../../model/workflow.model';
import { LunchTypeModel } from '../../model/lunch-type.model';
import { TaskNameModel } from '../../model/task-name.model';
import { Message, SelectItem } from 'primeng/components/common/api';
import { EmployModel } from '../../model/employ.model';
import { RoleModel } from '../../model/role.model';
import * as go from 'gojs';
import { TaskModel } from '../../model/task.model';
import { TaskTypeModel } from '../../model/task-type.model';
import { NodeDataArrayModel, GraphModel, LinkDataArrayModel } from '../../model/graph.model';
import { WorkflowService } from '../../services/workflow.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MessageService } from 'primeng/components/common/messageservice';
import { SettingLogicService } from '../../logic/setting-logic.service';
import { TaskLogicService } from '../../logic/task-logic.service';
import { WorkflowSaveValidationService } from '../../validation/workflow-save-validation.service';
import { EmployeLogicService } from '../../logic/employe-logic.service';
import { GraphLogicService } from '../../logic/graph-logic.service';
import { GraphValidationService } from '../../validation/graph-validation.service';
import { TaskValidationService } from '../../validation/task-validation.service';
import { LoadingService } from '../../core/loading-dialog/loading-dialog.component';
import { VersionConfirmDialogComponent } from '../version-confirm.dialog/version-confirm.dialog.component';
import { IdVersionModel } from '../../model/id-version.model';
import { WhileModel } from '../../model/while.model';

@Component({
  selector: 'app-show-config',
  templateUrl: './show-config.component.html',
  styleUrls: ['./show-config.component.css']
})
export class ShowConfigComponent implements OnInit {

  @ViewChild('myDiagramDiv') element: ElementRef;

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
  public taskName: TaskNameModel = new TaskNameModel();
  public errorMessages: Message[] = [];
  public employs: SelectItem[] = [];
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
    });
  }

  ngOnInit() {
    this.getTaskTypes();
    this.graphInitializer();
    if (this.workFlowId) {
      this.getWorkflow();
    } else {
      this.getLunchTypes();
    }
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
    this.task.persianName = this.taskName.persianName;
    this.task.name = this.taskName.name;
    this.task.isIf = this.taskName.type === 'if';
    this.task.isCommon = this.taskName.type === 'commonTask';
    this.workflowService.getSettingNames(this.task.name).subscribe(
      (res: string[]) => {
        this.task.settings = [];
        for (let i = 0; i < res.length; i++) {
          this.task.settings.push({
            name: res[i],
            value: res[i] === 'type' ? this.taskNames.find(x => x.name === this.task.name).type : '',
            attributes: res,
            isNewSetting: true,
            roles: [],
            users: []
          });
        }
      }, (error: any) => {
        this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: error, });
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
        // $(go.TextBlock,
        //   {
        //     font: 'bold 11pt IranianSansRegular, bold IranianSansRegular, IranianSansRegular',
        //     editable: true  // editing the text automatically updates the model data
        //   },
        //   new go.Binding('text').makeTwoWay())
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
      ); // end Adornment

    this.myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          curve: go.Link.Bezier, adjusting: go.Link.Stretch,
          reshapable: true, relinkableFrom: true, relinkabconsto: true,
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

  deconsteNode(e, obj) {
    const node: TaskModel = obj.part.adornedPart.data;
    this.workFlow.graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.workFlow.graph.nodeDataArray = JSON.parse(this.myDiagram.model.toJson()).nodeDataArray;
    this.workFlow.graph.class = JSON.parse(this.myDiagram.model.toJson()).class;
    this.workFlow.graph.nodeDataArray.splice(this.workFlow.graph.nodeDataArray.findIndex(x => x.key === node.key), 1);
    this.workFlow.graph.linkDataArray = this.graphLogicService.removeLinksOfRemovedNode(this.workFlow, node);
    if (this.workFlow.graph.whileGroups) {
      this.workFlow.graph.whileGroups = this.graphLogicService.removeWhileFromWhileGroup(this.workFlow, node);
    }
    this.workFlow.tasks = this.taskLogicService.removeTaskFromTaskList(this.workFlow.tasks, node.taskId);
    this.workFlow.newVersion = true;
    this.workFlow.isGraphEdited = true;

    if (this.workFlow.graph.nodeDataArray.find(x => x.doNodeId === node.key)) {
      this.workFlow.graph.nodeDataArray.find(x => x.doNodeId === node.key).doNodeId = null;
    }

    if (this.workFlow.graph.nodeDataArray.find(x => x.elseNodeId === node.key)) {
      this.workFlow.graph.nodeDataArray.find(x => x.elseNodeId === node.key).elseNodeId = null;
    }

    this.myDiagram.model = go.Model.fromJson(this.workFlow.graph);
  }

  openEditPanel(e, obj) {
    this.obj = obj;
    this.e = e;
    this.task = obj.part.adornedPart.data;
    this.task.description = obj.part.adornedPart.data.description;
    this.task.persianName = this.task.text;
    this.task.name = this.workFlow.tasks.find(x => x.id === this.task.taskId).name;
    this.task.settings = this.workFlow.tasks.find(x => x.id === this.task.taskId).settings;
    this.showSaveTaskPanel = true;
    this.taskEditMode = true;

    if (this.task.isIf) {
      this.taskType = this.taskTypes.find(x => x.name === 'if');
    } else if (this.task.isWhile) {
      this.taskType = this.taskTypes.find(x => x.name === 'while');
    } else if (this.task.isCommon) {
      this.taskType = this.taskTypes.find(x => x.name === 'commonTask');
    } else if (this.task.isSwitch) {
      this.taskType = this.taskTypes.find(x => x.name === 'switch');
    } else {
      this.taskType = this.taskTypes.find(x => x.name === 'task');
    }
    this.changeTaskTypeInList();
    this.taskName = this.taskNames.find(x => x.name === this.task.name);

    if (this.task.settings.find(x => x.name === 'کاربر')) {
      if (this.workFlow.tasks.find(x => x.id === this.task.taskId).settings.find(x => x.name === 'کاربر').value === '') {
        this.workFlow.tasks.find(x => x.id === this.task.taskId).settings.find(x => x.name === 'کاربر').value = '[]';
      }
      const employIds =
        JSON.parse(this.workFlow.tasks.find(x => x.id === this.task.taskId).settings.find(x => x.name === 'کاربر').value);
      employIds.forEach(element => {
        this.selectedEmploys.push(this.employs.find(x => x.value === element).value);
      });
    }

    if (this.task.settings.find(x => x.name === 'گروه کاربری')) {
      if (this.workFlow.tasks.find(x => x.id === this.task.taskId).settings.find(x => x.name === 'گروه کاربری').value === '') {
        this.workFlow.tasks.find(x => x.id === this.task.taskId).settings.find(x => x.name === 'گروه کاربری').value = '[]';
      }
      const roleIds =
        JSON.parse(this.workFlow.tasks.find(x => x.id === this.task.taskId).settings.find(x => x.name === 'گروه کاربری').value);
      roleIds.forEach(element => {
        // this.selectedRoles.push(this.employeLogicService.getRoleName(this.roles, element));
        this.selectedRoles.push(this.roles.find(x => x.value === element).label);
      });
    }
  }

  openLinkPanel(e, obj) {
    this.obj = obj;
    this.e = e;
    this.linkTasks = [];
    this.task = obj.part.adornedPart.data;
    this.task.persianName = this.task.text;

    const validation = this.graphValidationService.openLinkPanelValidation(this.workFlow.graph, this.task);
    if (validation.success === false) {
      this.showErrorMessage(validation.messages);
      return;
    }
    this.linkTasks = this.workFlow.graph.nodeDataArray.filter(x => x.key !== this.task.key);
    this.showLinkPanel = true;
  }

  saveLink() {
    const validation = this.graphValidationService.saveLink(this.workFlow.graph, this.task, this.linkTask);
    if (validation.success === false) {
      this.showErrorMessage(validation.messages);
      return;
    }

    const link = new LinkDataArrayModel();
    link.from = this.task.key;
    link.to = this.linkTask.key;
    if (this.task.isIf) {
      link.text = this.task.ifResult ? 'بله' : 'خیر';

      const task = this.workFlow.graph.nodeDataArray.find(x => x.key === this.task.key);
      task.doNodeId = this.task.ifResult ? this.linkTask.key : null;
      task.elseNodeId = !this.task.ifResult ? this.linkTask.key : null;
    }

    if (this.workFlow.graph.nodeDataArray.find(x => x.key === link.to).isRoot) {
      this.workFlow.graph.nodeDataArray.find(x => x.key === link.to).isRoot = false;
      this.workFlow.graph.nodeDataArray.find(x => x.key === link.from).isRoot = true;
    }

    this.workFlow.graph.linkDataArray.push(link);
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.graph));
    this.cancelAddTask();
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

    if (this.workFlow.isNew) {
      this.saveNewWorkflow();
    } else {
      this.checkSaveExistWorkflow();
    }
  }

  public checkSaveExistWorkflow() {
    this.workFlow = this.workflowSaveValidationService.checkForNeedNewVersion(
      this.workFlow,
      this.originalWorkFlow);

    if (this.workFlow.newVersion) {
      const dialogRef = this.dialog.open(VersionConfirmDialogComponent, {
        data: this.workFlow.versionChangeList,
        width: '50%',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.saveExistWorkFlow();
        }
      });
    } else {
      this.saveExistWorkFlow();
    }
  }

  saveExistWorkFlow() {
    this.workFlow.graph.nodeDataArray = JSON.parse(this.myDiagram.model.toJson()).nodeDataArray;
    this.workFlow.graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.errorMessages = [];
    this.workflowService.saveWorkflow(this.workFlow).subscribe(
      (res: any) => {
        if (res === false) {
          this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'اشکال سیستمی وجود دارد', });
          return;
        }
        this.errorMessages.push({ severity: 'success', summary: 'پیغام موفق', detail: 'فرایند با موفقیت ذخیره شد', });
        this.router.navigate(['../../designer/config/' + res.id + '/' + res.Version]);
        this.workFlowVersion = res.Version;
        this.getWorkflow();
      }, (error: any) => {

      }
    );
  }

  saveNewWorkflow() {
    this.workFlow.graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;

    this.errorMessages = [];
    this.workFlow.path += this.workFlow.name;
    this.workFlow.isNew = true;
    this.workflowService.saveWorkflow(this.workFlow).subscribe(
      (res: IdVersionModel) => {
        if (res) {
          this.errorMessages.push({ severity: 'success', summary: 'پیغام موفق', detail: 'فرایند با موفقیت ذخیره شد', });
          this.router.navigate(['../../designer/config/' + res.id + '/' + 0]);
          this.getWorkflow();
        } else {
          this.errorMessages.push({ severity: 'error', summary: 'پیغام خطا', detail: 'اشکال سیستمی وجود دارد', });
        }

      }, (error: any) => {
      }
    );
  }

  addTask() {
    if (!this.workFlow.graph.whileGroups) {
      this.workFlow.graph.whileGroups = [];
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
          {
            this.task.isInWhile = true;
          }
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

    if (this.workFlow.graph.nodeDataArray.length === 0) {
      this.task.isRoot = true;
    }

    this.task.id = this.generateTaskId();
    this.task.key = this.generateNodeKey();
    this.workFlow.tasks.push(this.task);

    this.workFlow.graph.linkDataArray = JSON.parse(this.myDiagram.model.toJson()).linkDataArray;
    this.workFlow.graph.nodeDataArray = JSON.parse(this.myDiagram.model.toJson()).nodeDataArray;
    this.workFlow.graph.class = JSON.parse(this.myDiagram.model.toJson()).class;

    const whileItem: WhileModel = new WhileModel();

    if (this.task.isWhile) {
      this.workFlow.graph.whileGroups.push({
        whileKey: this.task.key,
        taskIds: []
      });
    }
    // else if (this.task.isInWhile) {
    //   this.workFlow.graph.whileGroups.forEach(element => {
    //     if (element.taskIds.find(x => x === this.task.parentTask.key)) {
    //       whileItem = element;
    //       whileItem.taskIds.push(this.task.key);
    //     }
    //     if (element.whileKey === this.task.parentTask.key) {
    //       whileItem = element;
    //       whileItem.taskIds.push(this.task.key);
    //     }
    //   });
    // }

    if (this.task.isWhile || this.task.isInWhile) {
      this.workFlow.graph.linkDataArray.push({
        from: this.task.parentTask.key,
        to: this.task.key,
        text: this.determineLinkText()
      });

      if (this.task.parentTask.isInWhile) {
        this.workFlow.graph.linkDataArray.find(x => x.from === this.task.parentTask.key).from = this.task.key;
      } else {
        if (this.task.whileResult) {
          this.workFlow.graph.linkDataArray.push({
            from: this.task.key,
            to: whileItem.whileKey
          });
        }
      }
    } else if (this.task.isInSwitch) {
      if (this.task.isDefault) {
        this.workFlow.graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text: 'پیش فرض'
        });
      } else {
        const emp = this.employs.find(x => x.value === this.task.caseValue);
        this.workFlow.graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text: emp.label
        });
      }
    } else {
      if (this.task.parentTask.key) {
        this.workFlow.graph.linkDataArray.push({
          from: this.task.parentTask.key,
          to: this.task.key,
          text: this.determineLinkText()
        });
      }
    }

    if (this.task.parentTask) {
      if (this.task.parentTask.isIf) {
        const parent = this.workFlow.graph.nodeDataArray.find(x => x.key === this.task.parentTask.key);
        if (this.task.ifResult === true) {
          parent.doNodeId = this.task.key;
        } else if (this.task.ifResult === false) {
          parent.elseNodeId = this.task.key;
        }
      }
    }

    if (this.task.parentTask) {
      if (this.task.parentTask.isWhile) {
        const parent = this.workFlow.graph.nodeDataArray.find(x => x.key === this.task.parentTask.key);
        if (this.task.whileResult === true) {
          parent.doNodeId = this.task.key;
        } else if (this.task.whileResult === false) {
          parent.elseNodeId = this.task.key;
        }
      }
    }


    this.workFlow.graph.nodeDataArray.push({
      key: this.task.key,
      text: this.task.persianName,
      color: this.determineNodeColor(),
      Id: this.task.id,
      isIf: this.task.isIf,
      isSwitch: this.task.isSwitch,
      isInSwitch: this.task.isInSwitch,
      isWhile: this.task.isWhile,
      IsCommon: this.task.isCommon,
      description: this.task.description,
      loc: this.task.parentTask ? this.task.parentTask.taskId ? this.setLocation() : '' : '',
      taskId: this.task.id,
      isInWhile: this.task.isInWhile ? true : false,
      caseValue: this.task.caseValue,
      isRoot: this.task.isRoot,
      isDefault: this.task.isDefault,
    });

    this.myDiagram.model = go.Model.fromJson(this.workFlow.graph);
    this.cancelAddTask();
  }

  determineLinkText(): string {
    if (this.task.parentTask.isWhile) {
      if (this.task.whileResult) {
        return 'بله - ورود به حلقه';
      } else {
        return 'خیر - خروج از حلقه';
      }
    }
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
    if (this.task.isWhile) { return 'yellow'; }
    if (this.task.isIf) { return 'lightgreen'; }
    if (this.task.isSwitch) { return 'pink'; }
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
    if (!this.workFlow.graph.nodeDataArray) {
      this.workFlow.graph.nodeDataArray = [];
    }
    if (this.workFlow.graph.nodeDataArray.length === 0) {
      return 1;
    }
    const nodeKeys: number[] = [];
    this.workFlow.graph.nodeDataArray.forEach(element => {
      nodeKeys.push(element.key);
    });
    return Math.max(...nodeKeys) + 1;
  }

  public generateTaskId() {
    if (this.workFlow.tasks.length > 0) {
      return Math.max(...this.workFlow.tasks.map(x => x.id)) + 1;
    } else {
      return 1;
    }
  }

  newTask() {
    this.showSaveTaskPanel = true;
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

    const graphValidation = this.graphValidationService.editNodeValidate(this.task, this.workFlow.graph);
    if (graphValidation.success === false) {
      this.showErrorMessage(graphValidation.messages);
      return;
    }

    const node = this.workFlow.graph.nodeDataArray.find(x => x.key === this.task.key);
    node.text = this.task.persianName;

    let task = this.workFlow.tasks.find(x => x.id === this.task.taskId);
    task = this.task;
    task.description = this.task.description;
    this.workFlow.graph.nodeDataArray.find(x => x.key === this.task.key).description = this.task.description;
    this.myDiagram.model = go.Model.fromJson(JSON.stringify(this.workFlow.graph));

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
  }

  public getWorkflow() {
    this.workFlow.graph.nodeDataArray = [];
    this.workFlow.graph.linkDataArray = [];
    this.workFlow.graph.whileGroups = [];

    // this.isLoading = true;
    this.loading.start();
    this.workFlow = new WorkFlowModel();
    this.workflowService.getWorkFlow(this.workFlowId, this.workFlowVersion).subscribe(
      (res: WorkFlowModel) => {
        this.workFlow = res;
        this.workFlow.newVersion = false;
        this.workFlow.isNew = false;
        this.originalWorkFlow = JSON.parse(JSON.stringify(this.workFlow));
        if (this.workFlow.graph) {
          this.workFlow.graph = this.workFlow.graph;
        }
        this.getLunchTypes();
        this.myDiagram.model = go.Model.fromJson(this.workFlow.graph);
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
        this.taskNames = res.filter(x => x.type === this.taskType.name);
        // TODO. HANDLE THIS ACTION IN SERVER SIDE
        this.workFlow.tasks = this.taskLogicService.fillTaskPersianNames(this.workFlow, this.taskNames);
        if (this.showSaveTaskPanel) {
          this.taskName = this.taskNames.find(x => x.name === this.task.name);
        }
        this.task.isIf = this.taskType.name === 'if' ? true : false;
        this.task.isCommon = this.taskType.name === 'commonTask' ? true : false;
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
