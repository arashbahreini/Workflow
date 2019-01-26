export class ListPendingAndDoneModel {
    public workflowName: string;
    public doneRequestNumberUsers: RequestNumberUser[];
    public pendingRequestNumberUsers: RequestNumberUser[];
    public stopRequestNumberUsers: RequestNumberUser[];
}

export class RequestNumberUser {
    public RequestNumber: number;
    public UserFullName: string;
    public UserId: number;
    public UniqKey: string;
}
