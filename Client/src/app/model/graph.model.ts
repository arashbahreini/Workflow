import { WhileModel } from "./while.model";

export class GraphModel {
    public linkDataArray: LinkDataArrayModel[];
    public nodeDataArray: NodeDataArrayModel[];
    public nodeKeyProperty: string;
    public whileGroups: WhileModel[];
    public class: string;

    constructor() {
        this.whileGroups = [];
        this.linkDataArray = [];
        this.nodeDataArray = [];
    }
}

export class NodeDataArrayModel {
    public key?: number;
    public text: string;
    public color?: string;
    public loc?: string;
    public isIf?: boolean;
    public isWhile?: boolean;
    public isSwitch?: boolean;
    public isInSwitch?: boolean;
    public doNodeId?: number;
    public elseNodeId?: number;
    public childNodeId?: number;
    public isCommon: boolean;
    public id?: number;
    public description: string;
    public taskId: number;
    public isInWhile: boolean;
    public caseValue?: string;
    public isRoot: boolean;
    public isDefault: boolean;
    public pendingNumber?: number;
    public doneNumber?: number;
    public stopNumber?: number;
    public startDate?: string;
    public endDate?: string;
    public startDateDescription?: string;
    public endDateDescription?: string;
    public pendingDescription?: string;
    public doneDescription?: string;
    public stopDescription?: string;
    public doneDataModels?: DoneDataModel[];
    public pendingDataModels?: DoneDataModel[];
    public stopDataModels?: DoneDataModel[];
    public status?: string;
    public deadLine?: number;
    public deadLineDescription?: string;
}

export class DoneDataModel {
    public RequestNumber: string;
    public UniqKey: string;
}

export class LinkDataArrayModel {
    public from: number;
    public to: number;
    public text?: string;
    public curviness?: string;
    public points?: number[];
}

export class NodeDataToAdd {
    public key: number;
    public text: string;
    public color?: string;
    public loc: string;
    public isIf: boolean;
    public ifResult: boolean;
    public parentNode: NodeDataToAdd;
    public doNodeId: number;
    public elseNodeId: number;
    public childNodeId?: number;
    public description: string;
    public isCommon: boolean;
    public taskId?: number;
}
