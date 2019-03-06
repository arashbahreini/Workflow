export class WorkflowSummaryModel {
    public labels: string[];
    public workflowName: string;
    public datasets: DataSet[];
    public workflowId: number;
    public isLoading: boolean;
}

export class DataSet {
    public backgroundColor: string[];
    public data: number[];
    public hoverBackgroundColor: string[];
}
