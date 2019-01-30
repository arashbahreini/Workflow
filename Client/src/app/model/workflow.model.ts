import { TaskModel } from './task.model';
import { GraphModel } from './graph.model';

export class WorkFlowModel {
    public description?: string;
    public id?: number;
    public isEnabled: boolean;
    public isExecutionGraphEmpty?: boolean;
    public isPaused?: boolean;
    public isRunning?: boolean;
    public launchType: number;
    public name: string;
    public path?: string;
    public period?: string;
    public isNew: boolean;
    public version?: number;
    public deadLine: number;
    public tasks: TaskModel[];
    public graph?: GraphModel;
    public newVersion?: boolean;
    public isGraphEdited: boolean;
    public versionChangeList: string[];
    public requestId: number;
    public requestNumber: number;
    public versionDescription: string;
    constructor() {
        this.isEnabled = true;
        this.description = '';
        this.period = '';
        this.isNew = true;
        this.tasks = [];
        this.graph = new GraphModel();
    }
}
