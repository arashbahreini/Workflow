import { SettingModel } from './setting.model';

export class TaskModel {
    public description: string;
    public id: number;
    public isEnabled: boolean;
    public name: string;
    public settings: SettingModel[];
    public persianName: string;
    public isCommon?: boolean;
    public type: string;
    public parentTask: TaskModel;
    public isIf: boolean;
    public isTask: boolean;
    public isSwitch: boolean;
    public isInSwitch: boolean;
    public caseValue: string;
    public caseLinkValue: string;
    public isInWhile: boolean;
    public isWhile: boolean;
    public ifResult: boolean;
    public whileResult: boolean;
    public key: number;
    public text: string;
    public doNodeId: number;
    public elseNodeId: number;
    public doWhileKeys: number[];
    public elseWhileKeys: number[];
    public taskId: number;
    public isRoot: boolean;
    public goToWhile: boolean;
    public isDefault: boolean;
    public isDefaultInSwitch: boolean;

    constructor() {
        this.isEnabled = true;
        this.description = '';
        this.settings = [];
        this.isCommon = false;
    }
}
