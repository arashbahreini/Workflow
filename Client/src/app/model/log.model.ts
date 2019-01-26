export class LogModel {
    public Id: number;
    public WorkflowId: number;
    public Action: number;
    public TaskId: number;
    public TaskIndex: number;
    public TaskStatus: number;
    public TaskType: number;
    public CreationDate: string;
    public UserId: number;
    public RequestId: number;
    public RequestNumber: string;
    public TaskResult: boolean;
    public UniqKey: string;
    public WorkflowVersion: number;
    public CurrentTaskId: number;
    public TimeWasted: number;
    public isFinishedWorkflow: boolean;
    public StockedIndex: number;
    public TraversedIndexes: number[];
    public HasStockedIndexError: boolean;
}
