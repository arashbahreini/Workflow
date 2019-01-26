import { TaskModel } from './task.model';
import { GraphModel } from './graph.model';

export class WorkFlowModel {
    public Description?: string;
    public Id?: number;
    public IsEnabled: boolean;
    public IsExecutionGraphEmpty?: boolean;
    public IsPaused?: boolean;
    public IsRunning?: boolean;
    public LaunchType: number;
    public Name: string;
    public Path?: string;
    public Period?: string;
    public IsNew: boolean;
    public Version?: number;
    public DeadLine: number;
    public Tasks: TaskModel[];
    public Graph?: GraphModel;
    public NewVersion?: boolean;
    public isGraphEdited: boolean;
    public newVersion: number;
    public versionChangeList: string[];
    public requestId: number;
    public requestNumber: number;
    public VersionDescription: string;
    constructor() {
        this.IsEnabled = true;
        this.Description = '';
        this.Period = '';
        this.Path = 'C:\\workflow\\Workflows\\';
        this.IsNew = true;
        this.Tasks = [];
        this.Graph = new GraphModel();
    }
}
